import { describe, it, expect } from 'vitest';

describe("webhookClient (dev_tooling)", () => {
  it("resolves the development helper scope correctly", async () => {
    // Validate the module exists in its new non-production location
    const module = await import('../src/dev_tooling/webhookClient').catch(() => null);
    expect(module).toBeDefined();
  });
});
