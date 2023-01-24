import { Context } from "./context";
import { CommandData, CommandlineEvent, OptionData, ResultMapper } from "./interfaces";
import { parseOption } from "./parser";
import { ArgumentType, ActionFn } from "./types";
import { findCommands, findOptions, isOption } from "./utils";

export class Commandline<CK extends string, OM extends Record<string, unknown>> {
  static init(ns: NS) {
    ns.disableLog("ALL");
    return new Commandline<"", {}>(ns.args, Context.init(ns));
  }

  static mock(name: string, args: ArgumentType[]) {
    return new Commandline<"", {}>(args, Context.mock(name));
  }

  private _args: ArgumentType[];
  private _context: Context;

  private _commands: Record<string, CommandData<string>>;
  private _options: Record<string, OptionData<string, OM[keyof OM]>>;

  private _events: CommandlineEvent<ResultMapper<CK, OM>, CK, OM>[];

  private constructor(args: ArgumentType[], context: Context) {
    this._args = args;
    this._context = context;

    this._commands = {};
    this._options = {};

    this._events = [];
  }

  commands<N extends string>(data: CommandData<N>): Commandline<CK | N, OM> {
    this._commands[data.key] = data;
    return this as Commandline<CK | N, OM>;
  }

  options<N extends string, T>(data: OptionData<N, T>): Commandline<CK, OM & Record<N, T | undefined>> {
    this._options[data.key] = data as OptionData<string, OM[keyof OM]>;
    return this as Commandline<CK, OM & Record<N, T | undefined>>;
  }

  events(data: CommandlineEvent<ResultMapper<CK, OM>, CK, OM>): this {
    this._events.push(data);
    return this;
  }

  async build(cb?: ActionFn<ResultMapper<CK, OM>>): Promise<void> {
    await this._callPreloadEvents();
    const result: ResultMapper<CK, OM> = {
      commands: {} as Record<CK, string[]>,
      options: {} as OM,
      unknown: [],
      raw: this._args,
    };

    const remains: string[] = [];

    // load 'options'
    for (let i = 0; i < this._args.length; i++) {
      const arg = this._args[i];
      const sarg = arg.toString();

      if (isOption(sarg)) {
        const matched = findOptions(this._options, sarg);
        if (matched === undefined) {
          result.unknown.push(arg);
          continue;
        }

        await matched.event?.preload?.(this._context);
        const next = i < this._args.length - 1 ? this._args[i + 1] : undefined;

        const { key, value, skip } = await parseOption(matched, sarg, next?.toString(), this._context);
        await matched.event?.load?.(value, this._context);
        if (value !== undefined) {
          const oldValue = result.options[key];
          const newValue = Array.isArray(oldValue) ? (oldValue.concat(value) as OM[keyof OM]) : value;
          result.options[key] = newValue;
        }

        i += skip;
      } else {
        remains.push(sarg);
      }
    }

    // load 'commands'
    if (remains.length > 0) {
      const matched = findCommands<CK>(this._commands, remains);
      if (matched.length > 0) {
        await Promise.all(
          matched.map(async match => {
            await match.event?.preload?.(this._context);

            const values = remains.slice(match.values.length);
            result.commands[match.key] = values;

            await match.event?.load?.(values, this._context);
          })
        );
      } else {
        result.unknown.push(...remains);
      }
    }

    // call events
    await this._callLoadEvents(result);
    await this._callVerifyEvents(result);

    if (cb) await cb(result, this._context);
  }

  private async _callPreloadEvents(): Promise<void> {
    const result = this._events
      .filter(e => e.preload !== undefined)
      .map(event => Promise.resolve(event.preload?.(this._context)));
    await Promise.all(result);

    return;
  }

  private async _callLoadEvents(mapper: ResultMapper<CK, OM>): Promise<void> {
    const results = [];

    // Loaded commands
    const commandsResult = Object.keys(mapper.commands).map(key =>
      Promise.resolve(this._commands[key].event?.loaded?.(mapper.commands[key as CK], this._context))
    );
    results.push(...commandsResult);
    // Loaded options
    const optionsResult = Object.keys(mapper.options).map(key =>
      Promise.resolve(this._options[key].event?.loaded?.(mapper.options[key as keyof OM], this._context))
    );
    results.push(...optionsResult);
    // Loaded commandline
    results.push(...this._events.map(event => Promise.resolve(event.loaded?.(mapper, this._context))));

    await Promise.all(results);
    return;
  }

  private async _callVerifyEvents(mapper: ResultMapper<CK, OM>): Promise<void> {
    const _errors: Promise<Error | undefined>[] = [];

    // Verify individual command
    const commandResult = Object.keys(mapper.commands).map(key =>
      Promise.resolve(this._commands[key].event?.verify?.(mapper.commands[key as CK], this._context))
    );
    _errors.push(...commandResult);
    // Verify all commands
    const commandsResult = this._events.map(event =>
      Promise.resolve(event.verifyCommand?.(mapper.commands, this._context))
    );
    _errors.push(...commandsResult);
    // Verify individual option
    const optionResult = Object.keys(mapper.options).map(key =>
      Promise.resolve(this._options[key].event?.verify?.(mapper.options[key as keyof OM], this._context))
    );
    _errors.push(...optionResult);
    // Verify all options
    const optionsResult = this._events.map(event =>
      Promise.resolve(event.verifyOption?.(mapper.options, this._context))
    );
    _errors.push(...optionsResult);
    // Verify commandline
    const result = this._events.map(event => Promise.resolve(event.verify?.(mapper, this._context)));
    _errors.push(...result);

    const errors = await Promise.all(_errors).then(e => e.filter(v => v !== undefined) as Error[]);
    if (errors.length > 0) {
      throw new Error(`${errors.length} errors found: ${errors.map(e => `'${e.message}'`).join(",")}`);
    }

    return;
  }
}
