import { LOGGER_OUTPUT_SEPARATOR } from "./constants";

export enum LoggerOutput {
  TERMINAL = "terminal",
  LOG = "log",
}

const _getLoggerOutput = (name: string) => {
  switch (name.toLowerCase()) {
    case "log":
    case "l":
    case "file":
    case "f":
    case "internal":
    case "i":
      return LoggerOutput.LOG;
    default:
      return LoggerOutput.TERMINAL;
  }
};

export const getLoggerOutput = (name: string) => {
  const names = name.split(LOGGER_OUTPUT_SEPARATOR);
  return names.map(_getLoggerOutput);
};
