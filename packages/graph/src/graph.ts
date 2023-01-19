import type { GraphModifier, GraphOption, GraphTree, WalkCallback } from "./interfaces";

import { parseTree, walk } from "./parser";

export class Graph {
  static init(options: GraphOption, modifier?: GraphModifier) {
    const tree = parseTree(options);
    return new Graph(tree, modifier);
  }

  constructor(private tree: GraphTree, private modifier?: GraphModifier) {}

  walk(cb: WalkCallback) {
    Object.keys(this.tree).forEach(name => {
      const node = this.tree[name];
      walk(node, cb, this.modifier, [name]);
    });
  }

  toString() {
    return JSON.stringify(this.tree);
  }
}
