import { Logger } from "@kcbb-libs/logger";
import { Cache } from "@kcbb-libs/cache";
import { Graph } from "@kcbb-libs/graph";

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
  readonly graph: Graph;

  private constructor(readonly ns: NS) {
    this.logger = Logger.init(ns);
    this.cache = Cache.get();
    this.graph = Graph.init({
      startPoint: "home",
      resolver: host => ns.scan(host),
      static: ns.getPurchasedServers(),
    });
  }

  exit() {
    this.ns.exit();
  }
}
