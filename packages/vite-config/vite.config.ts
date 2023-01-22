import { resolve } from "path";
import { defineConfig } from "vite";

import externals from "rollup-plugin-node-externals";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  build: {
    sourcemap: "inline",
    lib: {
      entry: resolve(__dirname, "src", "index.ts"),
      formats: ["es"],
      name: "index",
      fileName: "index",
    },
    rollupOptions: {
      input: resolve(__dirname, "src", "index.ts"),
      output: {
        dir: "dist",
      },
      external: [
        "@rollup/plugin-typescript", "rollup-plugin-node-externals",
        "path", "fs", "url"
      ],
      plugins: [
        externals(),
        typescript({
          rootDir: resolve(__dirname, "src"),
          declaration: true,
          declarationDir: resolve(__dirname, "dist"),
          outputToFilesystem: true,
        }),
      ],
    },
  },
});
