import { Converter } from "./converter";
import { DefineOption } from "./interfaces";

export const defineVersionOption: DefineOption<string, "version", boolean> = (version: string) => ({
  name: "version",
  options: ["--version", "-v"],
  default: () => false,
  convert: Converter.bool,
  exec: (enabled, ctx) => {
    if (enabled) {
      ctx.logger.print("Version: %s", version);
      ctx.exit();
    }
  },
});

export const defineLoggerOption: DefineOption<void, "log-level", string> = () => ({
  name: "log-level",
  options: ["--log-level", "-l"],
  default: () => "info",
  convert: Converter.string,
  exec: (lvl, ctx) => {
    ctx.logger.setLevels(lvl);
  },
});

export const defineTargetOption: DefineOption<void, "target", Server> = () => ({
  name: "target",
  options: ["--target", "-T"],
  default: ctx =>
    ctx.graph.maximum<Server>(
      host => ctx.ns.getServer(host),
      server => server.moneyAvailable
    ),
  convert: (host, ctx) => ctx.ns.getServer(host),
});
