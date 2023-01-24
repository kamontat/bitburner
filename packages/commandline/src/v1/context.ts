import { Logger } from "@kcbb-libs/logger";
import { Cache } from "@kcbb-libs/cache";
import { Graph } from "@kcbb-libs/graph";
import { Result } from "./interfaces";

export class Context {
  static init(ns: NS): Context {
    return new Context(ns);
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

  exit(cb?: () => void) {
    cb && this.ns.atExit(cb);
    this.ns.exit();
  }

  debugResult<M extends Record<string, unknown>>(result: Result<M>): void {
    this.logger.tdebug("Commands: %s", result.commands);
    Object.keys(result.options).forEach(key => {
      const value = result.options[key];
      this.logger.tdebug("  - %s = %s", key, value);
    });
  }
}
