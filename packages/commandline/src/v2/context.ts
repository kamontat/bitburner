import { Cache } from "@kcbb-libs/cache";
import { Graph } from "@kcbb-libs/graph";
import { Logger } from "@kcbb-libs/logger";
import { ResultMapper } from "./interfaces";

export class Context {
  static init(ns: NS) {
    return new Context(ns);
  }

  static mock() {
    return new Context(undefined as unknown as NS);
  }

  readonly logger: Logger;
  readonly cache: Cache;
  readonly graph: Graph;

  private constructor(readonly ns: NS) {
    this.cache = Cache.get();

    this.logger = Logger.init(ns);
    this.graph = Graph.init({
      startPoint: "home",
      resolver: host => ns?.scan(host) ?? [],
      static: ns?.getPurchasedServers(),
    });
  }

  exit(cb?: () => void) {
    if (cb) this.ns.atExit(cb);
    this.ns.exit();
  }

  debugResult<CK extends string, OM extends Record<string, unknown>>(result: ResultMapper<CK, OM>): void {
    this.logger.tdebug("Commands:");
    Object.keys(result.commands).forEach(key => {
      const value = result.commands[key as CK];
      this.logger.tdebug("  - %s = [%s]", key, value.join(","));
    });

    this.logger.tdebug("Options:");
    Object.keys(result.options).forEach(key => {
      const value = result.options[key];
      this.logger.tdebug("  - %s = %s", key, value);
    });
  }
}
