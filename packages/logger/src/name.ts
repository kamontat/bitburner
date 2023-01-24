import { LOGGER_INPUT_SEPARATOR } from "./constants";
import { getLoggerOutput, LoggerOutput } from "./output";

export interface LoggerName {
  key: string;
  output: LoggerOutput[];
}

export const getLoggerName = (s: string): LoggerName => {
  const arr = s.split(LOGGER_INPUT_SEPARATOR);
  if (arr.length === 2) return { key: arr[0], output: getLoggerOutput(arr[1]) };
  return { key: s, output: getLoggerOutput("") };
};

export const checkLoggerName = (name: string, names: Record<string, LoggerOutput[]>) => {
  const key = Object.keys(names).find(key => key === name && names[key].length > 0);
  return key === undefined ? [] : names[key];
};
