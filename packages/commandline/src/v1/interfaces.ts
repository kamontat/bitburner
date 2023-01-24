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
export type VerifierFn<T> = ValueCallback<T, Error | undefined>;

export interface OptionHelp {
  description?: string;
}

export interface OptionData<N extends string, T> {
  name: N;
  options: string[];
  help?: OptionHelp;
  /** convert raw data from input to certain data type */
  convert: Converter<T>;
  /** convert data back to string for help message */
  asString?: ValueCallback<T, string>;
  /** define default value if no user input */
  default?: EmptyCallback<T>;
  /** verify option value */
  verify?: VerifierFn<T>;
  /** perform action on option value */
  exec?: ValueCallback<T, void>;
}

export interface CommandHelp {
  description?: string;
}

export interface CommandData<N extends string> {
  name: N;
  commands: string[];
  help?: CommandHelp;
  verify?: VerifierFn<string[]>;
  exec?: ValueCallback<string[], void>;
}

export type DefineOption<I extends any[], N extends string, T> = (...input: I) => OptionData<N, T>;
