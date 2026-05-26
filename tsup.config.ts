import { defineConfig } from "tsup";
import type { Options } from "tsup";

const config: Options = {
  entry: {
    index: "src/index.ts",
    "server/index": "src/server/index.ts"
  },
  dts: true,
  format: ["cjs", "esm"],
  inject: ["./react-import.js"],
  injectStyles: true,
  external: [
    "react",
    "react-dom",
    "@crediblemark/build",
    "@google/generative-ai",
    "lucide-react"
  ],
  clean: true,
  sourcemap: true,
  minify: false,
};

export default defineConfig(config);
