import { defineConfig } from "tsup";
import { resolve } from "path";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  esbuildOptions(options) {
    options.alias = {
      "@utils": resolve(__dirname, "./src/utils"),
      "@endpoints": resolve(__dirname, "./src/endpoints"),
      "@core": resolve(__dirname, "./src/core"),
      "@services": resolve(__dirname, "./src/services"),
      "@tests": resolve(__dirname, "./tests"),
      "@test-helpers": resolve(__dirname, "./tests/helpers"),
    };
  },
});
