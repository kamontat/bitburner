export enum ConfigType {
  APP = "app",
  LIB = "lib",
}

export interface ConfigOptions {
  /** base directory name (default = __dirname) */
  dirname: string;
  /** package json file name (default = package.json) */
  pkgname?: string;
  /** entry file (default = index.ts) */
  indexname?: string;
  /** source code directory */
  srcdir?: string;
  /** destination directory */
  distdir?: string;
  /** source map (default = inline) */
  sourcemap?: false | "inline";
}
