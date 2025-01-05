import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      "@config": resolve(__dirname, "./src/config"),
      "@endpoints": resolve(__dirname, "./src/endpoints"),
      "@services": resolve(__dirname, "./src/services"),
      "@tests": resolve(__dirname, "./tests"),
      "@test-helpers": resolve(__dirname, "./tests/helpers"),
    },
  },
});
