import type {
  GraphData,
  GraphDataValue,
  GraphModifier,
  GraphOption,
  GraphResolver,
  GraphTree,
  WalkCallback,
} from "./interfaces";

const _parseTree = (
  resolver: GraphResolver<string>,
  key: string,
  traveled: Record<string, boolean> = {}
): GraphTree | GraphData | undefined => {
  console.log(`parse ${key}, ${JSON.stringify(traveled)}`);
  if (traveled[key]) return;

  const result: GraphTree = {};

  const _connected = resolver(key);
  const connected = _connected.filter(c => !traveled[c]);
  console.log(`connect to ${connected}`);

  traveled[key] = true;

  if (connected.length === 0) {
    console.log(`stop ${key} and return`);
    return {
      _data: {
        enabled: true,
        name: key,
      },
    };
  }

  for (const next of connected) {
    console.log(`resolve ${next}/${key}`);
    const value = _parseTree(resolver, next, traveled);
    console.log(`return ${JSON.stringify(value)} from ${next}/${key}`);
    if (value !== undefined) {
      result[next] = {
        ...value,
        _data: {
          enabled: true,
          name: next,
        },
      };
    }
  }

  return result;
};

const _buildTreeFromArray = (tree: GraphTree, elements: string[]): GraphTree => {
  elements.forEach(name => (tree[name] = { _data: { enabled: true, name } }));
  return tree;
};

// LIMITATION:  Currently this function not guarantee shortest path
//              However, it's guarantee only unique name will be return
//              regardless of the connection level.
// IMPROVEMENT: Loop per level instead of loop deep level.
export const parseTree = (options: GraphOption): GraphTree => {
  const startPoint = options?.startPoint ?? "home";

  let tree = {};
  if (options.resolver) tree = _parseTree(options.resolver, startPoint) ?? {};
  if (options.static && options.static.length > 0) tree = _buildTreeFromArray(tree, options.static);

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

export const walk = (input: GraphTree | GraphData, cb: WalkCallback, modifier?: GraphModifier, prev: string[] = []) => {
  // Data will be null on tree root
  const data = input._data as GraphDataValue;
  const isEnabled = data.enabled;
  const name = data.name;

  // console.log(`walk ${name}`);

  const isBL = isBlacklist(name, modifier);
  if (isBL) return;

  if (isEnabled) {
    const current = prev[prev.length - 1];
    const isWL = isWhitelist(current, modifier);
    if (isWL) cb(current, prev);
  }

  const tree = input as GraphTree;
  const connections = Object.keys(tree).filter(key => key !== "_data");
  connections.forEach(h => walk(tree[h], cb, modifier, prev.concat(h)));
};
