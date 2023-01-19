import { Logger } from "@kcbb-libs/logger";
import { Cache } from "@kcbb-libs/cache";

export class Context {
  private static _instance: Context;

  static init(ns: NS): Context {
    if (!Context._instance) Context._instance = new Context(ns);
    return Context._instance;
  }

  static get(): Context {
    if (!Context._instance) throw new Error(`Initiate context before call .get()`);
    return Context._instance;
  }

  readonly logger: Logger;
  readonly cache: Cache;

  constructor(readonly ns: NS) {
    this.logger = Logger.init(ns);
    this.cache = Cache.get();
  }
}
