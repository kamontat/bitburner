import type { Context } from "./context";

export type ArgumentType = string | number | boolean;

export type EmptyCallback<T> = (ctx: Context) => T | Promise<T>;
export type ValueCallback<V, T> = (value: V, ctx: Context) => T | Promise<T>;

export type ConvertFn<T> = ValueCallback<string, T>;
export type VerifyFn<T> = ValueCallback<T, Error | undefined>;
export type DefaultFn<T> = EmptyCallback<T>;
export type ActionFn<T> = ValueCallback<T, void>;
