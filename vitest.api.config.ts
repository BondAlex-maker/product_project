import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    include: ["tests/api/**/*.test.ts"],
    reporters: "default",
    pool: "threads",
    testTimeout: 30000
  }
});
