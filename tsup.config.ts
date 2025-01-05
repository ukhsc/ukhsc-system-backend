import { defineConfig } from "tsup";
import { resolve } from "path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  esbuildOptions(options) {
    options.alias = {
      "@config": resolve(__dirname, "./src/config"),
      "@endpoints": resolve(__dirname, "./src/endpoints"),
      "@services": resolve(__dirname, "./src/services"),
      "@tests": resolve(__dirname, "./tests"),
      "@test-helpers": resolve(__dirname, "./tests/helpers"),
    };
  },
});
