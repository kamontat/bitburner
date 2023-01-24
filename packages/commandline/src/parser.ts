import { Context } from "./context";
import { Converts } from "./converts";
import { OptionData } from "./interfaces";
import { isOption } from "./utils";

interface OptionMapper<K, V> {
  key: K;
  value: V | undefined;
  skip: number;
}

const _parseEqualOption = (current: string): OptionMapper<string, string> | undefined => {
  const equals = current.indexOf("=");
  // contains '=' (equals), meaning value is on option argument itself
  if (equals > 0) {
    const key = current.substring(0, equals);
    const value = current.substring(equals + 1);
    return { key, value, skip: 0 };
  }

  return undefined;
};

const _parseOption = (current: string, next: string | undefined): OptionMapper<string, string> => {
  const equals = _parseEqualOption(current);
  if (equals) return equals;

  // using next as value for current option
  if (next && !isOption(next)) {
    return { key: current, value: next, skip: 1 };
  }

  // doesn't has next value
  return { key: current, value: undefined, skip: 0 };
};

const _parseFlag = (current: string, next: string | undefined): OptionMapper<string, string> => {
  const equals = _parseEqualOption(current);
  if (equals) return equals;

  // using next as value for current option
  if (next === "true" || next === "false") {
    return { key: current, value: next, skip: 1 };
  }

  // doesn't has next value
  return { key: current, value: "true", skip: 0 };
};

export const parseOption = async <M>(
  data: OptionData<string, M[keyof M]>,
  current: string,
  next: string | undefined,
  ctx: Context
): Promise<OptionMapper<keyof M, M[keyof M]>> => {
  // If no convert function, we will never parse next argument
  const raw = data.convert ? _parseOption(current, next) : _parseFlag(current, next);
  const option: OptionMapper<keyof M, M[keyof M]> = {
    key: data.key as keyof M,
    value: undefined,
    skip: raw.skip,
  };

  if (raw.value === undefined && data.default) {
    option.value = await data.default(ctx);
  } else if (raw.value !== undefined) {
    if (data.convert) option.value = await data.convert(raw.value, ctx);
    else option.value = Converts.bool(raw.value) as M[keyof M];
  }

  return option;
};
