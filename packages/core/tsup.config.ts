import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    types: "src/types.ts",
    utils: "src/utils.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  skipNodeModulesBundle: true,
  tsconfig: "./tsconfig.build.json",
  treeshake: true,
  splitting: false,
  minify: false,
});
