import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function callStructuredWithMock(
  options: {
    assertClientConfig?: (config: {
      apiKey: string;
      baseURL?: string;
      defaultHeaders?: Record<string, string>;
    }) => void;
    createImplementation?: (request: {
      model: string;
      reasoning?: { enabled: boolean };
    }) => Promise<{ choices: [{ message: { content: string } }] }> | { choices: [{ message: { content: string } }] };
    expectedCreateCalls?: number;
  } = {}
) {
  const {
    assertClientConfig,
    expectedCreateCalls = 1,
    createImplementation = () =>
      Promise.resolve({
        choices: [{ message: { content: "{\"value\":1}" } }],
      }),
  } = options;

  const createSpy = vi.fn().mockImplementation(createImplementation);

  vi.doMock("openai", () => ({
    default: vi.fn().mockImplementation((config: {
      apiKey: string;
      baseURL?: string;
      defaultHeaders?: Record<string, string>;
    }) => {
      assertClientConfig?.(config);
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

  expect(createSpy).toHaveBeenCalledTimes(expectedCreateCalls);
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

    await callStructuredWithMock({
      assertClientConfig: (config) => {
        expect(config.apiKey).toBe("sk-test");
        expect(config.baseURL).toBe("https://openrouter.ai/api/v1");
        expect(config.defaultHeaders).toMatchObject({
          "HTTP-Referer": "https://readyourusers.test",
          "X-Title": "ReadYourUsers",
        });
      },
    });
  });

  it("omits default headers for generic openai-compatible endpoints", async () => {
    vi.stubEnv("OPENAI_BASE_URL", "https://api.openai.com/v1");

    await callStructuredWithMock({
      assertClientConfig: (config) => {
        expect(config.apiKey).toBe("sk-test");
        expect(config.baseURL).toBe("https://api.openai.com/v1");
        expect(config.defaultHeaders).toBeUndefined();
      },
    });
  });

  it("retries OpenRouter requests with configured fallback models on retryable errors", async () => {
    vi.stubEnv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1");
    vi.stubEnv("OPENAI_FALLBACK_MODELS", "openai/gpt-oss-120b:free,z-ai/glm-4.5-air:free");

    const attemptedModels: string[] = [];
    const rateLimitError = Object.assign(new Error("rate limited"), { status: 429 });
    let callCount = 0;

    await callStructuredWithMock({
      expectedCreateCalls: 2,
      createImplementation: (request) => {
        attemptedModels.push(request.model);
        callCount += 1;
        if (callCount === 1) {
          return Promise.reject(rateLimitError);
        }
        return Promise.resolve({
          choices: [{ message: { content: "{\"value\":1}" } }],
        });
      },
    });

    expect(attemptedModels).toEqual([
      "test-model",
      "openai/gpt-oss-120b:free",
    ]);
  });

  it("does not use free-model fallbacks for non-OpenRouter endpoints", async () => {
    vi.stubEnv("OPENAI_BASE_URL", "https://api.openai.com/v1");
    vi.stubEnv("OPENAI_FALLBACK_MODELS", "openai/gpt-oss-120b:free");

    let callCount = 0;
    await expect(
      callStructuredWithMock({
        createImplementation: () => {
          callCount += 1;
          return Promise.reject(Object.assign(new Error("rate limited"), { status: 429 }));
        },
      })
    ).rejects.toMatchObject({ status: 429 });

    expect(callCount).toBe(1);
  });

  it("does not retry non-retryable errors even on OpenRouter", async () => {
    vi.stubEnv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1");
    vi.stubEnv("OPENAI_FALLBACK_MODELS", "openai/gpt-oss-120b:free");

    let callCount = 0;
    await expect(
      callStructuredWithMock({
        createImplementation: () => {
          callCount += 1;
          return Promise.reject(Object.assign(new Error("bad request"), { status: 400 }));
        },
      })
    ).rejects.toMatchObject({ status: 400 });

    expect(callCount).toBe(1);
  });

  it("disables reasoning for Teamo Router requests so content is returned", async () => {
    vi.stubEnv("OPENAI_BASE_URL", "https://router.teamolab.com/v1");

    await callStructuredWithMock({
      assertClientConfig: (config) => {
        expect(config.baseURL).toBe("https://router.teamolab.com/v1");
      },
      createImplementation: (request) => {
        expect(request).toMatchObject({
          model: "test-model",
          reasoning: { enabled: false },
        });
        return Promise.resolve({
          choices: [{ message: { content: "{\"value\":1}" } }],
        });
      },
    });
  });
});
