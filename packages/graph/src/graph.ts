import type { Converter, GraphModifier, GraphOption, GraphTree, ReduceCallback, WalkCallback } from "./interfaces";

import { parseTree, walk, reduce } from "./parser";

export class Graph {
  static init(options: GraphOption, modifier?: GraphModifier) {
    const tree = parseTree(options);
    return new Graph(tree, modifier);
  }

  private modifier: Required<GraphModifier>;

  constructor(private tree: GraphTree, modifier?: GraphModifier) {
    this.modifier = {
      blacklist: modifier?.blacklist ?? [],
      whitelist: modifier?.whitelist ?? [],
    };
  }

  setBlacklist(bl: string[]) {
    this.modifier.blacklist = bl;
  }

  setWhitelist(wl: string[]) {
    this.modifier.whitelist = wl;
  }

  maximum<T>(convert: Converter<string, T>, comparison: Converter<T, number>): T {
    return this.reduce({ output: undefined as T | undefined, number: 0 }, (prev, host) => {
      const data = convert(host);
      const value = comparison(data);
      if (value > prev.number) {
        prev.output = data;
        prev.number = value;
      }

      return prev;
    }).output!;
  }

  walk(cb: WalkCallback) {
    walk(this.tree, cb, this.modifier);
  }

  reduce<T>(def: T, cb: ReduceCallback<T>): T {
    return reduce(this.tree, def, cb, this.modifier);
  }

  toString() {
    return JSON.stringify(this.tree);
  }
}
