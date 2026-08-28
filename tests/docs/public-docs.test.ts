import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("public docs and automation", () => {
  it("keeps README copy, generator snapshots, and workflow defaults aligned", () => {
    const readme = readFileSync("README.md", "utf-8");
    const readmeZh = readFileSync("README.zh.md", "utf-8");
    const workflow = readFileSync(".github/workflows/weekly-report.yml", "utf-8");
    const generator = readFileSync("src/pipeline/generator.ts", "utf-8");
    const constants = readFileSync("src/config/constants.ts", "utf-8");
    const readmeTemplates = readFileSync("src/pipeline/readme-templates.ts", "utf-8");

    const openRouterSetupBlock = [
      "LLM_PROVIDER=openai",
      "OPENAI_API_KEY=your_openrouter_key",
      "OPENAI_BASE_URL=https://openrouter.ai/api/v1",
      "OPENROUTER_HTTP_REFERER=https://github.com/study8677/ReadYourUsers",
      "OPENROUTER_APP_TITLE=ReadYourUsers",
      "ANALYSIS_MODEL=qwen/qwen3.6-plus:free",
      "AGGREGATION_MODEL=qwen/qwen3.6-plus:free",
    ].join("\n");

    const observatoryOutputLines = [
      "reports/latest/<repo>.md",
      "reports/latest/<repo>.zh.md",
      "reports/latest/cross-product.json",
      "site/en/index.html",
      "site/en/compare/index.html",
      "site/en/products/<slug>.html",
      "site/zh/index.html",
      "site/zh/compare/index.html",
      "site/zh/products/<slug>.html",
    ];

    expect(readme).toContain("public multi-product observatory");
    expect(readme).toContain("[Compare](https://study8677.github.io/ReadYourUsers/en/compare/index.html)");
    expect(readme).toContain("[Product page](https://study8677.github.io/ReadYourUsers/en/products/");
    expect(readme).toContain(openRouterSetupBlock);
    for (const line of observatoryOutputLines) {
      expect(readme).toContain(line);
    }

    expect(readmeZh).toContain("多产品观测站");
    expect(readmeZh).toContain("[对比页](https://study8677.github.io/ReadYourUsers/zh/compare/index.html)");
    expect(readmeZh).toContain("[产品页](https://study8677.github.io/ReadYourUsers/zh/products/");
    expect(readmeZh).toContain(openRouterSetupBlock);
    for (const line of observatoryOutputLines) {
      expect(readmeZh).toContain(line);
    }

    expect(workflow).toContain(
      "OPENAI_BASE_URL: ${{ vars.OPENAI_BASE_URL || 'https://api.teamorouter.cn/v1' }}"
    );
    expect(workflow).toContain(
      "OPENROUTER_HTTP_REFERER: ${{ vars.OPENROUTER_HTTP_REFERER || format('{0}/{1}', github.server_url, github.repository) }}"
    );
    expect(workflow).toContain("OPENROUTER_APP_TITLE: ${{ vars.OPENROUTER_APP_TITLE || 'ReadYourUsers' }}");
    expect(workflow).toContain("ANALYSIS_MODEL: ${{ vars.ANALYSIS_MODEL || 'gpt-5.6-sol' }}");
    expect(workflow).toContain("AGGREGATION_MODEL: ${{ vars.AGGREGATION_MODEL || 'gpt-5.6-sol' }}");
    expect(workflow).toContain("MAX_PAGES_DEFAULT=\"${{ vars.DEFAULT_FETCH_MAX_PAGES || '1' }}\"");

    // URL constants are now centralized in config/constants.ts
    expect(constants).toContain(
      "const PUBLIC_SITE_COMPARE_EN_URL = `${PUBLIC_SITE_URL}en/compare/index.html`;"
    );
    expect(constants).toContain(
      "const PUBLIC_SITE_COMPARE_ZH_URL = `${PUBLIC_SITE_URL}zh/compare/index.html`;"
    );
    expect(constants).toContain('const PROJECT_GITHUB_URL = "https://github.com/study8677/ReadYourUsers";');

    // README templates moved to readme-templates.ts
    expect(readmeTemplates).toContain("[Compare](${PUBLIC_SITE_COMPARE_EN_URL})");
    expect(readmeTemplates).toContain("[Product page](${PUBLIC_SITE_URL}en/products/${slug}.html)");
    expect(readmeTemplates).toContain("[对比页](${PUBLIC_SITE_COMPARE_ZH_URL})");
    expect(readmeTemplates).toContain("[产品页](${PUBLIC_SITE_URL}zh/products/${slug}.html)");
    expect(readmeTemplates).toContain("OPENROUTER_HTTP_REFERER=${PROJECT_GITHUB_URL}");

    // Cross-product output path referenced in README templates
    expect(readmeTemplates).toContain("reports/latest/cross-product.json");
  });
});
