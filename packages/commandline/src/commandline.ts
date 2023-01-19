import type { ArgumentType, OptionData, OptionMapper, Result, ValueCallback } from "./interfaces";

import { Context } from "./context";
import { parseMapper } from "./parser";

export class Commandline<M> {
  static init(ns: NS): Commandline<{}> {
    return new Commandline(ns.args, Context.init(ns));
  }

  // For testing only
  static test(args: ArgumentType[]): Commandline<{}> {
    return new Commandline(args, Context.init(undefined as any));
  }

  private _mapper: OptionMapper;

  private _result: Result<Record<string, unknown>>;

  private constructor(args: ArgumentType[], private context: Context) {
    this._mapper = parseMapper(args);

    this._result = {
      commands: this._mapper.commands,
      raw: this._mapper.raw,
      options: {},
    };
  }

  options<N extends string, T>(data: OptionData<N, T>): Commandline<M & Record<N, T>> {
    let raw = this.getMapper(...data.options);

    if (raw === undefined && !data.default)
      throw new Error(`'${data.name}' is requires option, please add either [${data.options}]`);

    if (raw === undefined && data.default) {
      this._result.options[data.name] = data.default(this.context);
    } else if (raw !== undefined) {
      this._result.options[data.name] = data.convert(raw, this.context);
    }

    if (data.verify) {
      const result = this._result.options[data.name];
      const error = data.verify(result as T, this.context);
      if (error) throw error;
    }

    if (data.exec) {
      const result = this._result.options[data.name];
      data.exec(result as T, this.context);
    }

    return this as Commandline<M & Record<N, T>>;
  }

  build(cb: ValueCallback<Result<M>, void>) {
    cb(this._result as Result<M>, this.context);
  }

  private getMapper(...fields: string[]): string | undefined {
    for (const field of fields) {
      const value = this._mapper.options[field];
      if (value !== undefined && value !== null) return value;
    }

    return undefined;
  }
}
