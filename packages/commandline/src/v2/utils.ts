import { CommandData, OptionData } from "./interfaces";

export const isOption = (s: string) => {
  return s.startsWith("-");
};

export const findOptions = <N extends string, T>(
  options: Record<string, OptionData<N, T>>,
  arg: string
): OptionData<N, T> | undefined => {
  const key = Object.keys(options).find(key => options[key].values.some(v => arg.startsWith(v)));
  return key !== undefined ? options[key] : undefined;
};

export const findCommands = <N extends string>(
  commands: Record<string, CommandData<string>>,
  args: string[]
): CommandData<N>[] => {
  const keys = Object.keys(commands).filter(key => {
    const cmd = commands[key];
    const _args = args.slice(0, cmd.values.length);
    return _args.every((a, i) => a === cmd.values[i]);
  });

  return keys.map(key => commands[key] as CommandData<N>);
};
