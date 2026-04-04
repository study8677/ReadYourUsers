import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import type { ZodType } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { logger } from "../utils/logger.js";

type Provider = "anthropic" | "openai";

function getProvider(): Provider {
  const provider = process.env.LLM_PROVIDER ?? "anthropic";
  if (provider !== "anthropic" && provider !== "openai") {
    throw new Error(`Unknown LLM_PROVIDER: ${provider}. Use "anthropic" or "openai".`);
  }
  return provider;
}

// --- Anthropic ---
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY not set.");
    }
    anthropicClient = createAnthropicClient(apiKey);
  }
  return anthropicClient;
}

// --- OpenAI-compatible ---
let openaiClient: OpenAI | null = null;

function isOpenRouterBaseUrl(baseUrl: string | undefined): boolean {
  return Boolean(baseUrl?.includes("openrouter.ai"));
}

function isTeamoRouterBaseUrl(baseUrl: string | undefined): boolean {
  return Boolean(baseUrl?.includes("router.teamolab.com"));
}

function getOpenAIHeaders(): Record<string, string> | undefined {
  const headers: Record<string, string> = {};

  if (process.env.OPENROUTER_HTTP_REFERER) {
    headers["HTTP-Referer"] = process.env.OPENROUTER_HTTP_REFERER;
  }

  if (process.env.OPENROUTER_APP_TITLE) {
    headers["X-Title"] = process.env.OPENROUTER_APP_TITLE;
  }

  return Object.keys(headers).length > 0 ? headers : undefined;
}

function getOpenAIModelFallbacks(primaryModel: string): string[] {
  if (!isOpenRouterBaseUrl(process.env.OPENAI_BASE_URL)) {
    return [primaryModel];
  }

  const rawFallbacks = process.env.OPENAI_FALLBACK_MODELS
    ?? "openai/gpt-oss-120b:free,qwen/qwen3-next-80b-a3b-instruct:free,z-ai/glm-4.5-air:free";

  const fallbacks = rawFallbacks
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index)
    .filter((value) => value !== primaryModel);

  return [primaryModel, ...fallbacks];
}

function isRetryableOpenAIError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const status = (error as Error & { status?: number }).status;
  return status === 404 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not set.");
    }
    openaiClient = createOpenAIClient({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL,
      defaultHeaders: getOpenAIHeaders(),
    });
  }
  return openaiClient;
}

/** Create a new Anthropic client instance. */
export function createAnthropicClient(apiKey: string): Anthropic {
  return new Anthropic({ apiKey });
}

/** Create a new OpenAI-compatible client instance. */
export function createOpenAIClient(config: {
  apiKey: string;
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
}): OpenAI {
  return new OpenAI(config);
}

/** Reset cached clients. Exported for testing. */
export function resetClients(): void {
  anthropicClient = null;
  openaiClient = null;
}

export interface StructuredCallOptions<T> {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  schema: ZodType<T>;
  schemaName: string;
  maxTokens?: number;
  useCache?: boolean;
}

/**
 * Call LLM with structured output.
 * Dispatches to Anthropic or OpenAI-compatible based on LLM_PROVIDER env var.
 */
export async function callStructured<T>(
  options: StructuredCallOptions<T>
): Promise<T> {
  const provider = getProvider();
  if (provider === "anthropic") {
    return callAnthropicStructured(options);
  }
  return callOpenAIStructured(options);
}

// =====================================================
// Anthropic implementation
// =====================================================
async function callAnthropicStructured<T>(
  options: StructuredCallOptions<T>
): Promise<T> {
  const { model, systemPrompt, userPrompt, schema, schemaName, maxTokens = 1024, useCache = true } = options;
  const client = getAnthropicClient();

  const systemContent: Anthropic.TextBlockParam[] = [
    {
      type: "text" as const,
      text: systemPrompt,
      ...(useCache ? { cache_control: { type: "ephemeral" as const } } : {}),
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonSchema = zodToJsonSchema(schema as ZodType<any>, { target: "openApi3" });

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemContent,
    messages: [{ role: "user", content: userPrompt }],
    tools: [
      {
        name: schemaName,
        description: `Output structured data as ${schemaName}`,
        input_schema: jsonSchema as Anthropic.Tool["input_schema"],
      },
    ],
    tool_choice: { type: "tool", name: schemaName },
  });

  const toolBlock = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolBlock) {
    throw new Error("No tool_use block in response");
  }

  return schema.parse(toolBlock.input);
}

// =====================================================
// OpenAI-compatible implementation
// =====================================================
async function callOpenAIStructured<T>(
  options: StructuredCallOptions<T>
): Promise<T> {
  const { model, systemPrompt, userPrompt, schema, schemaName, maxTokens = 1024 } = options;
  const client = getOpenAIClient();
  const baseUrl = process.env.OPENAI_BASE_URL;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonSchema = zodToJsonSchema(schema as ZodType<any>, { target: "openApi3" });
  const modelsToTry = getOpenAIModelFallbacks(model);
  let response: Awaited<ReturnType<typeof client.chat.completions.create>> | null = null;
  let lastError: unknown;

  for (let index = 0; index < modelsToTry.length; index += 1) {
    const candidateModel = modelsToTry[index];
    try {
      response = await client.chat.completions.create({
        model: candidateModel,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: userPrompt + `\n\nRespond with a JSON object matching this schema:\n${JSON.stringify(jsonSchema, null, 2)}`,
          },
        ],
        response_format: { type: "json_object" },
        ...(isTeamoRouterBaseUrl(baseUrl) ? { reasoning: { enabled: false } } : {}),
      });
      break;
    } catch (error) {
      lastError = error;

      if (index === modelsToTry.length - 1 || !isRetryableOpenAIError(error)) {
        throw error;
      }

      logger.warn(`OpenAI-compatible call failed for model ${candidateModel}, retrying with fallback`, {
        error: error instanceof Error ? error.message : String(error),
        nextModel: modelsToTry[index + 1],
      });
    }
  }

  if (!response) {
    throw lastError instanceof Error
      ? lastError
      : new Error("OpenAI-compatible request failed before a response was received.");
  }

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from LLM");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    // Sometimes the model wraps JSON in markdown code blocks
    const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      parsed = JSON.parse(match[1]);
    } else {
      throw new Error(`Failed to parse LLM response as JSON: ${content.slice(0, 200)}`);
    }
  }

  // If the response wraps data in a key matching the schema name, unwrap it
  if (
    typeof parsed === "object" &&
    parsed !== null &&
    schemaName in parsed &&
    typeof (parsed as Record<string, unknown>)[schemaName] === "object"
  ) {
    parsed = (parsed as Record<string, unknown>)[schemaName];
  }

  return schema.parse(parsed);
}

