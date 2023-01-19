export type GraphResolver<T> = (name: T) => T[];
export type List<T> = T[];

export type Converter<A, B> = (a: A) => B;

export interface GraphDataValue {
  enabled: boolean;
  name: string;
}

export interface GraphData {
  _data: GraphDataValue;
}

export interface GraphTree {
  [key: string]: GraphNode;
}

export type GraphNode = (GraphTree & GraphData) | GraphData;

export interface GraphOption {
  resolver?: GraphResolver<string>;
  startPoint?: string;
  static?: List<string>;
}

export interface GraphModifier {
  blacklist?: List<string>;
  whitelist?: List<string>;
}

export type WalkCallback = (hostname: string, paths: string[]) => void;
export type ReduceCallback<T> = (prev: T, hostname: string, paths: string[]) => T;
