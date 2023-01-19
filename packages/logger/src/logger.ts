import { checkLevel, Level, LEVEL_DEBUG, LEVEL_ERROR, LEVEL_INFO, LEVEL_WARN } from "./level";

export class Logger {
  private static _instance: Logger;

  static init(ns: NS): Logger {
    if (!Logger._instance) Logger._instance = new Logger(ns);
    return Logger._instance;
  }

  static get(): Logger {
    if (!Logger._instance) throw new Error(`Initiate logger before call .get()`);
    return Logger._instance;
  }

  private levels: string[];

  constructor(private ns: NS) {
    this.levels = [];
  }

  setLevels(level: string[]) {
    this.levels = level;
  }

  enable(...names: string[]) {
    this.ns.disableLog("ALL");
    for (const name of names) {
      this.ns.enableLog(name);
    }
  }

  debug(format: string, ...args: string[]) {
    this._log(LEVEL_DEBUG, format, ...args);
  }

  tdebug(format: string, ...args: string[]) {
    this._print(LEVEL_DEBUG, format, ...args);
  }

  info(format: string, ...args: string[]) {
    this._log(LEVEL_INFO, format, ...args);
  }

  tinfo(format: string, ...args: string[]) {
    this._print(LEVEL_INFO, format, ...args);
  }

  warn(format: string, ...args: string[]) {
    this._log(LEVEL_WARN, format, ...args);
  }

  twarn(format: string, ...args: string[]) {
    this._print(LEVEL_WARN, format, ...args);
  }

  error(format: string, ...args: string[]) {
    this._log(LEVEL_ERROR, format, ...args);
  }

  terror(format: string, ...args: string[]) {
    this._print(LEVEL_ERROR, format, ...args);
  }

  private _log(lvl: Level, format: string, ...args: string[]) {
    if (checkLevel(this.levels, lvl)) {
      this.ns.printf(format, ...args);
    }
  }

  private _print(lvl: Level, format: string, ...args: string[]) {
    if (checkLevel(this.levels, lvl)) {
      this.ns.tprintf(format, ...args);
    }
  }
}
