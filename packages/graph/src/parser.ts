import type {
  GraphData,
  GraphModifier,
  GraphNode,
  GraphOption,
  GraphResolver,
  GraphTree,
  ReduceCallback,
  WalkCallback,
} from "./interfaces";

const _parseTree = (points: string[], resolver: GraphResolver<string>, traveled: Record<string, boolean> = {}) => {
  const _points = points.filter(p => !traveled[p]);

  // console.log(`points: ${points} => ${_points}`);
  const result: GraphTree = {};

  for (const point of _points) {
    traveled[point] = true;
    result[point] = {
      _data: {
        enabled: true,
        name: point,
      },
    };
  }

  for (const point of _points) {
    result[point] = {
      ...result[point],
      ..._parseTree(resolver(point), resolver, traveled),
    };
  }

  return result;
};

const _buildTreeFromArray = (tree: GraphTree, elements: string[]): GraphTree => {
  elements.forEach(name => {
    const data = {
      _data: {
        enabled: true,
        name,
      },
    } as GraphTree & GraphData;
    tree[name] = data;
  });
  return tree;
};

export const parseTree = (options: GraphOption): GraphTree => {
  const startPoint = options?.startPoint ?? "home";

  let tree = {};
  if (options.resolver) {
    tree = _parseTree(options.resolver(startPoint), options.resolver, { [startPoint]: true });
  }
  if (options.static && options.static.length > 0) {
    tree = _buildTreeFromArray(tree, options.static);
  }

  return tree;
};

const isBlacklist = (name: string, modifier?: GraphModifier): boolean => {
  const bl = modifier?.blacklist ?? [];
  if (bl.length > 0 && name !== "") return bl.includes(name);
  else return false;
};

const isWhitelist = (name: string, modifier?: GraphModifier): boolean => {
  const wl = modifier?.whitelist ?? [];
  if (wl.length > 0 && name !== "") return wl.includes(name);
  else return true;
};

const _walk = (input: GraphNode, cb: WalkCallback, modifier?: GraphModifier, prev: string[] = []) => {
  const name = input._data.name;

  const isEnabled = input._data.enabled;
  const isBL = isBlacklist(name, modifier);
  if (!isEnabled || isBL) return;

  const current = prev[prev.length - 1];
  const isWL = isWhitelist(current, modifier);
  if (isWL) cb(current, prev);

  const raw = input as Record<string, GraphNode>;
  Object.keys(raw)
    .filter(key => key !== "_data")
    .forEach(key => _walk(raw[key], cb, modifier, prev.concat(key)));
};

export const walk = (tree: GraphTree, cb: WalkCallback, modifier?: GraphModifier) => {
  Object.keys(tree).forEach(key => {
    const node = tree[key];
    _walk(node, cb, modifier, [key]);
  });
};

export const reduce = <T>(tree: GraphTree, def: T, cb: ReduceCallback<T>, modifier?: GraphModifier): T => {
  return Object.keys(tree).reduce((prev, key) => {
    const node = tree[key];
    const callback: WalkCallback = (h, p) => (prev = cb(prev, h, p));
    _walk(node, callback, modifier, [key]);

    return prev;
  }, def);
};
