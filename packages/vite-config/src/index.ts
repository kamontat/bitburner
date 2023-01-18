import type { UserConfigExport } from "vite";

import { readFileSync } from "fs";
import { resolve } from "path";
import externals from "rollup-plugin-node-externals";
import typescript from "@rollup/plugin-typescript";

import { ConfigType, ConfigOptions } from "./constants";

export const defineConfig = (type: ConfigType, options: ConfigOptions): UserConfigExport => {
  const dirname = options.dirname;
  const pkgname = options?.pkgname ?? "package.json";
  const indexname = options?.indexname ?? "index.ts";
  const sourcemap = options?.sourcemap ?? "inline";
  const globals = options?.globals ?? undefined;
  const srcdir = options?.srcdir ?? "src";
  const distdir = options?.distdir ?? "dist";

  const pkg = JSON.parse(readFileSync(resolve(dirname, pkgname), { encoding: "utf-8" }));

  const name = pkg.name;
  const displayName = pkg.displayName ?? "index";
  const version = pkg.version;
  const buildDate = new Date().toISOString();

  const entry = resolve(dirname, srcdir, indexname);
  const dir = type === ConfigType.APP ? `../../${distdir}` : distdir;

  let typescriptConfig = undefined;
  if (type !== ConfigType.APP) {
    typescriptConfig = {
      rootDir: resolve(dirname, srcdir),
      declaration: true,
      declarationDir: resolve(dirname, distdir),
    };
  }

  return {
    build: {
      sourcemap,
      lib: {
        formats: ["es"],
        entry,
        name: displayName,
        fileName: displayName,
      },
      rollupOptions: {
        input: entry,
        output: {
          dir,
          globals,
        },
        external: globals && Object.keys(globals),
        plugins: [externals(), typescript(typescriptConfig)],
      },
    },
    define: {
      __NAME__: JSON.stringify(name),
      __VERSION__: JSON.stringify(version),
      __BUILD_DATE__: JSON.stringify(buildDate),
    },
  };
};

export { ConfigType };
