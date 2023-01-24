import { LOGGER_INPUT_SEPARATOR } from "./constants";
import { checkLoggerName, getLoggerName } from "./name";
import { LoggerOutput } from "./output";

export class Logger {
  static init(ns: NS): Logger {
    return new Logger(ns);
  }

  private names: Record<string, LoggerOutput[]>;

  constructor(private ns: NS) {
    this.names = {};
  }

  enableName(s: string): this {
    if (s.includes(LOGGER_INPUT_SEPARATOR)) {
      const name = getLoggerName(s);
      this.names[name.key] = name.output;
    } else {
      this.ns.enableLog(s);
    }

    return this;
  }

  disableName(s: string): this {
    if (s.includes(LOGGER_INPUT_SEPARATOR)) {
      const name = getLoggerName(s);
      delete this.names[name.key];
    } else {
      this.ns.disableLog(s);
    }

    return this;
  }

  log(name: string, format: string, ...args: unknown[]) {
    const outputs = checkLoggerName(name, this.names);
    const result = this._format(name, format, ...args);

    outputs.forEach(out => {
      switch (out) {
        case LoggerOutput.LOG:
          this.ns.print(result);
          return;
        case LoggerOutput.TERMINAL:
          this.ns.tprint(result);
      }
    });
  }

  print(format: string, ...args: unknown[]) {
    this.ns.tprintf(format, ...args);
  }

  private _format(name: string, format: string, ...args: unknown[]) {
    return this.ns.sprintf(`[%s] ${format}`, name, ...args);
  }
}
