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
        expect(config.baseURL).toBe("https://api.teamorouter.cn/v1");
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

  it("disables reasoning for the current Teamo host", async () => {
    vi.stubEnv("OPENAI_BASE_URL", "https://api.teamorouter.cn/v1");

    await callStructuredWithMock({
      assertClientConfig: (config) => {
        expect(config.baseURL).toBe("https://api.teamorouter.cn/v1");
      },
      createImplementation: (request) => {
        expect(request).toMatchObject({
          reasoning: { enabled: false },
        });
        return Promise.resolve({
          choices: [{ message: { content: "{\"value\":1}" } }],
        });
      },
    });
  });
});

describe("resolveOpenAIBaseUrl", () => {
  beforeEach(() => {
    vi.resetModules();
  });
  it("rewrites the retired Teamo host and trims whitespace", async () => {
    const { resolveOpenAIBaseUrl } = await import("../../src/llm/client.js");
    expect(resolveOpenAIBaseUrl("  https://router.teamolab.com/v1/  ")).toBe(
      "https://api.teamorouter.cn/v1"
    );
    expect(resolveOpenAIBaseUrl("https://teamorouter.cn/v1")).toBe(
      "https://api.teamorouter.cn/v1"
    );
    expect(resolveOpenAIBaseUrl("https://api.teamorouter.cn/v1")).toBe(
      "https://api.teamorouter.cn/v1"
    );
  });

  it("returns undefined for empty values", async () => {
    const { resolveOpenAIBaseUrl } = await import("../../src/llm/client.js");
    expect(resolveOpenAIBaseUrl(undefined)).toBeUndefined();
    expect(resolveOpenAIBaseUrl("   ")).toBeUndefined();
  });

  it("rejects API keys and other non-URL values with a clear error", async () => {
    const { resolveOpenAIBaseUrl } = await import("../../src/llm/client.js");
    expect(() => resolveOpenAIBaseUrl("sk-or-v1-not-a-url")).toThrow(
      /OPENAI_BASE_URL is not a valid http\(s\) URL/
    );
  });

  it("rejects non-http protocols", async () => {
    const { resolveOpenAIBaseUrl } = await import("../../src/llm/client.js");
    expect(() => resolveOpenAIBaseUrl("ftp://example.com/v1")).toThrow(
      /must start with http:\/\/ or https:\/\//
    );
  });
});
