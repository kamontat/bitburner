import { CommandData, FullHelpValue, OptionData } from "./interfaces";

type HelpObject<T> = Required<Omit<FullHelpValue<T>, "default" | "defaultFn">> &
  Pick<FullHelpValue<T>, "default" | "defaultFn">;

const DEFAULT_DESCRIPTION = "<no-description>";

export class Help {
  static init() {
    return new Help();
  }

  private cmdHelp: Map<string, HelpObject<unknown>>;
  private optHelp: Map<string, HelpObject<unknown>>;

  private constructor() {
    this.cmdHelp = new Map();
    this.optHelp = new Map();
  }

  addCmd(data: CommandData<string>) {
    const value: HelpObject<unknown> = {
      values: data.values,
      default: undefined,

      description: data.help?.description ?? DEFAULT_DESCRIPTION,
      defaultFn: undefined,
    };

    this.cmdHelp.set(data.key, value);
  }

  addOpt<T>(data: OptionData<string, T>) {
    const defaultFn = data.default && !data.help?.defaultFn ? (v: unknown) => `${v}` : data.help?.defaultFn;
    const value = {
      values: data.values,
      default: data.default,

      description: data.help?.description ?? DEFAULT_DESCRIPTION,
      defaultFn,
    } as HelpObject<unknown>;

    this.optHelp.set(data.key, value);
  }

  listCmd(): Array<[string, HelpObject<unknown>]> {
    return Array.from(this.cmdHelp.entries());
  }

  listOpt(): Array<[string, HelpObject<unknown>]> {
    return Array.from(this.optHelp.entries());
  }
}
