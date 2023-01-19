import { Context } from "./context";

export type KV<K, V> = { key: K; value: V };
export type EmptyCallback<T> = (ctx: Context) => T;
export type ValueCallback<V, T> = (value: V, ctx: Context) => T;

export type ArgumentType = string | number | boolean;

export interface OptionMapper {
  options: Record<string, string>;
  commands: ArgumentType[];
  raw: ArgumentType[];
}

export interface Result<M> {
  commands: ArgumentType[];
  options: M;
  raw: ArgumentType[];
}

export type Converter<T> = ValueCallback<string, T>;

export interface OptionData<N extends string, T> {
  name: N;
  options: string[];
  convert: Converter<T>;
  default?: EmptyCallback<string>;
}
