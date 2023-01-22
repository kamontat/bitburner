import type { ArgumentType, OptionData, OptionMapper, Result, ValueCallback } from "./interfaces";

import { Context } from "./context";
import { parseMapper } from "./parser";
import { defineHelpOption, defineInfoOption, defineLoggerOption, defineVersionOption } from "./constants";

export class Commandline<M> {
  static init(ns: NS): Commandline<{}> {
    ns.disableLog("ALL");
    return new Commandline(ns.getScriptName(), ns.args, Context.init(ns));
  }

  // For testing only
  static test(name: string, args: ArgumentType[]): Commandline<{}> {
    return new Commandline(name, args, Context.init(undefined as any));
  }

  private _mapper: OptionMapper;
  private _options: OptionData<string, unknown>[];

  private _result: Result<Record<string, unknown>>;

  private constructor(private name: string, args: ArgumentType[], private context: Context) {
    this._mapper = parseMapper(args);
    this._result = {
      commands: this._mapper.commands,
      raw: this._mapper.raw,
      options: {},
    };

    this._options = [];
  }

  default(logNames: string[], name: string, version: string, date: string) {
    return this.options(defineLoggerOption(logNames))
      .options(defineHelpOption())
      .options(defineVersionOption(version))
      .options(defineInfoOption(name, version, date));
  }

  options<N extends string, T>(data: OptionData<N, T>): Commandline<M & Record<N, T>> {
    this._options.push(data as OptionData<string, unknown>);
    return this as Commandline<M & Record<N, T>>;
  }

  async build(cb: ValueCallback<Result<M>, Promise<void>>): Promise<void> {
    const errors: Error[] = [];
    const options: string[] = [];
    for (const data of this._options) {
      let raw = this.getMapper(...data.options);

      if (raw === undefined && !data.default)
        errors.push(new Error(`'${data.name}' is requires option, please add either [${data.options}]`));

      if (raw === undefined && data.default) {
        this._result.options[data.name] = data.default(this.context);
      } else if (raw !== undefined) {
        this._result.options[data.name] = data.convert(raw, this.context);
      }

      if (data.verify) {
        const result = this._result.options[data.name];
        const error = data.verify(result, this.context);
        if (error) errors.push(error);
      }

      if (data.exec) {
        const result = this._result.options[data.name];
        data.exec(result, this.context);
      }

      let option = data.options.join(",");
      let prefix = "";
      let description = data.help?.description ?? "<no-description>";
      let suffix = "";

      if (!data.default) prefix = "[<required>]";
      if (data.default) {
        prefix = "[<optional>]";
        const def = data.default(this.context) as string;

        if (data.asString) suffix = `(${data.asString(def, this.context)})`;
        else suffix = `(${def})`;
      }

      options.push(`'${option}': ${prefix} ${description} ${suffix}`);
    }

    if (this._result.options["help"]) {
      this.context.exit(() => {
        this.context.logger.print(
          `Usage %s
  options:
    - %s
`,
          this.name,
          options.join("\n    - ")
        );
      });
    } else {
      if (errors.length > 0) throw new Error(`${errors.length} errors found: ${errors}`);
      await cb(this._result as Result<M>, this.context);
    }

    return;
  }

  private getMapper(...fields: string[]): string | undefined {
    for (const field of fields) {
      const value = this._mapper.options[field];
      if (value !== undefined && value !== null) return value;
    }

    return undefined;
  }
}
