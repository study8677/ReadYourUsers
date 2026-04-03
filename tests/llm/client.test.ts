import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function callStructuredWithMock(
  assertConfig: (config: {
    apiKey: string;
    baseURL?: string;
    defaultHeaders?: Record<string, string>;
  }) => void
) {
  const createSpy = vi.fn().mockResolvedValue({
    choices: [{ message: { content: "{\"value\":1}" } }],
  });

  vi.doMock("openai", () => ({
    default: vi.fn().mockImplementation((config: {
      apiKey: string;
      baseURL?: string;
      defaultHeaders?: Record<string, string>;
    }) => {
      assertConfig(config);
      return { chat: { completions: { create: createSpy } } };
    }),
  }));

  const { callStructured } = await import("../../src/llm/client.js");
  const { z } = await import("zod");

  await callStructured({
    model: "test-model",
    systemPrompt: "Return JSON",
    userPrompt: "Return JSON",
    schema: z.object({ value: z.number() }),
    schemaName: "TestSchema",
  });

  expect(createSpy).toHaveBeenCalledTimes(1);
}

describe("getOpenAIClient", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("LLM_PROVIDER", "openai");
    vi.stubEnv("OPENAI_API_KEY", "sk-test");
  });

  afterEach(() => {
    vi.doUnmock("openai");
    vi.clearAllMocks();
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("passes OpenRouter base URL and headers through the OpenAI-compatible client", async () => {
    vi.stubEnv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1");
    vi.stubEnv("OPENROUTER_HTTP_REFERER", "https://readyourusers.test");
    vi.stubEnv("OPENROUTER_APP_TITLE", "ReadYourUsers");

    await callStructuredWithMock((config) => {
      expect(config.apiKey).toBe("sk-test");
      expect(config.baseURL).toBe("https://openrouter.ai/api/v1");
      expect(config.defaultHeaders).toMatchObject({
        "HTTP-Referer": "https://readyourusers.test",
        "X-Title": "ReadYourUsers",
      });
    });
  });

  it("omits default headers for generic openai-compatible endpoints", async () => {
    vi.stubEnv("OPENAI_BASE_URL", "https://api.openai.com/v1");

    await callStructuredWithMock((config) => {
      expect(config.apiKey).toBe("sk-test");
      expect(config.baseURL).toBe("https://api.openai.com/v1");
      expect(config.defaultHeaders).toBeUndefined();
    });
  });
});
