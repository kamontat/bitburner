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
  /** convert raw data from input to certain data type */
  convert: Converter<T>;
  /** define default value if no user input */
  default?: EmptyCallback<T>;
  /** verify option value */
  verify?: ValueCallback<T, Error | undefined>;
  /** perform action on option value */
  exec?: ValueCallback<T, void>;
}

export type DefineOption<I, N extends string, T> = (input: I) => OptionData<N, T>;
