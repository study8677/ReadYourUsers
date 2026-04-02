import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import type { ZodType } from "zod";
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
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

// --- OpenAI-compatible ---
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not set.");
    }
    openaiClient = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL,
    });
  }
  return openaiClient;
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

  const jsonSchema = zodToJsonSchema(schema);

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

  const jsonSchema = zodToJsonSchema(schema);

  const response = await client.chat.completions.create({
    model,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: userPrompt + `\n\nRespond with a JSON object matching this schema:\n${JSON.stringify(jsonSchema, null, 2)}`,
      },
    ],
    response_format: { type: "json_object" },
  });

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

// =====================================================
// Zod → JSON Schema converter
// =====================================================
function zodToJsonSchema(schema: ZodType<unknown>): Record<string, unknown> {
  const def = (schema as unknown as { _def: Record<string, unknown> })._def;
  return zodDefToJsonSchema(def);
}

function zodDefToJsonSchema(def: Record<string, unknown>): Record<string, unknown> {
  const typeName = def.typeName as string;

  switch (typeName) {
    case "ZodObject": {
      const shape = def.shape as () => Record<string, { _def: Record<string, unknown>; description?: string }>;
      const shapeObj = shape();
      const properties: Record<string, unknown> = {};
      const required: string[] = [];

      for (const [key, value] of Object.entries(shapeObj)) {
        const propSchema = zodDefToJsonSchema(value._def);
        const desc = value.description ?? (value._def.description as string | undefined);
        if (desc) {
          (propSchema as Record<string, unknown>).description = desc;
        }
        properties[key] = propSchema;
        if ((value._def.typeName as string) !== "ZodOptional") {
          required.push(key);
        }
      }

      return { type: "object", properties, required };
    }
    case "ZodString":
      return { type: "string" };
    case "ZodNumber": {
      const result: Record<string, unknown> = { type: "number" };
      const checks = def.checks as Array<{ kind: string; value: number }> | undefined;
      if (checks) {
        for (const check of checks) {
          if (check.kind === "min") result.minimum = check.value;
          if (check.kind === "max") result.maximum = check.value;
        }
      }
      return result;
    }
    case "ZodBoolean":
      return { type: "boolean" };
    case "ZodEnum": {
      const values = def.values as string[];
      return { type: "string", enum: values };
    }
    case "ZodArray": {
      const innerType = def.type as { _def: Record<string, unknown> };
      const items = zodDefToJsonSchema(innerType._def);
      const result: Record<string, unknown> = { type: "array", items };
      const minLength = def.minLength as { value: number } | null;
      const maxLength = def.maxLength as { value: number } | null;
      if (minLength) result.minItems = minLength.value;
      if (maxLength) result.maxItems = maxLength.value;
      return result;
    }
    case "ZodEffects": {
      const inner = def.schema as { _def: Record<string, unknown> };
      return zodDefToJsonSchema(inner._def);
    }
    case "ZodOptional": {
      const inner = def.innerType as { _def: Record<string, unknown> };
      return zodDefToJsonSchema(inner._def);
    }
    case "ZodDefault": {
      const inner = def.innerType as { _def: Record<string, unknown> };
      return zodDefToJsonSchema(inner._def);
    }
    default:
      logger.warn(`Unknown Zod type: ${typeName}, falling back to any`);
      return {};
  }
}
