export type GraphResolver<T> = (name: T) => T[];
export type List<T> = T[];

export interface GraphDataValue {
  enabled: boolean;
  name: string;
}

export interface GraphData {
  _data: GraphDataValue;
}

export interface GraphTree {
  [key: string]: GraphTree | GraphData;
}

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
