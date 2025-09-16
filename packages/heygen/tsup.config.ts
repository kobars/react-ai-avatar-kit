import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    types: "src/types.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "@heygen/streaming-avatar"],
  skipNodeModulesBundle: true,
  tsconfig: "./tsconfig.build.json",
  treeshake: true,
  splitting: true,
  minify: true,
  metafile: true,
});
