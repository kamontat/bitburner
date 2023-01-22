import { Converter } from "./converter";
import { DefineOption } from "./interfaces";

export const defineHelpOption: DefineOption<[], "help", boolean> = () => ({
  name: "help",
  options: ["--help", "-h"],
  help: {
    description: "show help information",
  },
  default: () => false,
  convert: Converter.bool,
});

export const defineVersionOption: DefineOption<[string], "version", boolean> = (version: string) => ({
  name: "version",
  options: ["--version", "-v"],
  default: () => false,
  convert: Converter.bool,
  exec: (enabled, ctx) => {
    if (enabled) {
      ctx.exit(() => {
        ctx.logger.print("version: %s", version);
      });
    }
  },
});

export const defineInfoOption: DefineOption<[string, string, string], "info", boolean> = (name, version, date) => ({
  name: "info",
  options: ["--info", "-i"],
  default: () => false,
  convert: Converter.bool,
  exec: (enabled, ctx) => {
    if (enabled) {
      ctx.exit(() => {
        ctx.logger.print("%s: %s (%s)", name, version, date);
      });
    }
  },
});

export const defineLoggerOption: DefineOption<[string[]], "log-level", string> = (names) => ({
  name: "log-level",
  options: ["--log-level", "-l"],
  default: () => "info",
  convert: Converter.string,
  exec: (lvl, ctx) => {
    ctx.logger.enable(...names);
    ctx.logger.setLevels(lvl);
  },
});

export const defineTargetOption: DefineOption<[], "target", Server> = () => ({
  name: "target",
  options: ["--target", "-T"],
  default: ctx =>
    ctx.graph.maximum<Server>(
      host => ctx.ns.getServer(host),
      server => server.moneyAvailable
    ),
  asString: s => s.hostname,
  convert: (host, ctx) => ctx.ns.getServer(host),
});

export const defineWhitelistOption: DefineOption<[], "whitelist", string[]> = () => ({
  name: "whitelist",
  options: ["--whitelist", "-W", "--server", "-E"],
  help: { description: "whitelist only server to execute" },
  default: () => [],
  convert: Converter.array,
  exec: (value, ctx) => ctx.graph.setWhitelist(value),
});

export const defineBlacklistOption: DefineOption<[], "blacklist", string[]> = () => ({
  name: "blacklist",
  options: ["--blacklist", "-B"],
  help: { description: "blacklist server from execute" },
  default: () => [],
  convert: Converter.array,
  exec: (value, ctx) => ctx.graph.setBlacklist(value),
});
