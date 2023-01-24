import type { ArgumentType, KV, OptionMapper } from "./interfaces";

export const parseKeyValue = (
  current: ArgumentType,
  next: ArgumentType | undefined
): KV<string, string> & { skip: number } => {
  const _current = current.toString();
  const _next = next?.toString() ?? undefined;

  if (!_next || _next.startsWith("-")) return { key: _current, value: "true", skip: 0 };

  const equalSign = _current.indexOf("=");
  if (equalSign < 0) return { key: _current, value: _next ?? "true", skip: 1 };

  const key = _current.substring(0, equalSign);
  const value = _current.substring(equalSign + 1);
  return { key, value, skip: 0 };
};

export const parseMapper = (args: ArgumentType[]): OptionMapper => {
  const result: OptionMapper = {
    commands: [],
    options: {},
    raw: args,
  };

  for (let i = 0; i < args.length; i++) {
    const current = args[i];
    const currentStr = current.toString();
    const isOption = currentStr.startsWith("-");

    if (!isOption) {
      result.commands.push(current);
      continue;
    }

    const next = i < args.length - 1 ? args[i + 1] : undefined;
    const kv = parseKeyValue(current, next);
    result.options[kv.key] = kv.value;
    i += kv.skip;
  }

  return result;
};
