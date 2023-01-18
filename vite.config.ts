import { readFileSync } from 'fs';
import { resolve } from 'path'
import { defineConfig } from 'vite'

const pkg = JSON.parse(readFileSync(resolve(__dirname, "package.json"), { encoding: "utf-8" }));

export default defineConfig({
  build: {
    sourcemap: "inline",
    lib: {
      entry: {
        "init": resolve(__dirname, "src", "init.ts"),
        "deploy": resolve(__dirname, "src", "deploy.ts"),
      },
      formats: ["es"]
    }
  },
  resolve: {
    alias: {
      "@constants": resolve(__dirname, "src", "constants"),
      "@interfaces": resolve(__dirname, "src", "interfaces"),
      "@models": resolve(__dirname, "src", "models"),
      "@utils": resolve(__dirname, "src", "utils")
    }
  },
  define: {
    __NAME__: JSON.stringify(pkg.name),
    __VERSION__: JSON.stringify(pkg.version),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
})
