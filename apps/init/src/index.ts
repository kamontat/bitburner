import { Commandline, Defaults, Converts, Verifies } from "@kcbb-libs/commandline";

const main: MainFunction = async ns => {
  await Commandline.init(ns)
    .options({
      key: "log",
      values: ["--log", "-l"],
      default: Defaults.constant([]),
      convert: Converts.array,
      event: {
        verify: Verifies.required("log"),
        loaded: (value, ctx) => {
          value.forEach(v => ctx.logger.enableName(v));
        },
      },
    })
    .options({
      key: "version",
      values: ["--version", "-v"],
      default: Defaults.constant(false),
      event: {
        loaded: (value, ctx) => {
          if (value === true) {
            ctx.exit(() => {
              ctx.logger.print(`%s: %s (%s)`, __NAME__, __VERSION__, __BUILD_DATE__);
            });
          }
        },
      },
    })
    .options({
      key: "help",
      values: ["--help", "-h"],
      default: Defaults.constant(false),
    })
    .events({
      verify: result => {
        if (result.unknown.length > 0) {
          return new Error(`Invalid commands/options: ${result.unknown.join(",")}`);
        }
        return undefined;
      },
    })
    .events({
      loaded: (result, ctx) => {
        if (result.options.help !== true) {
          return;
        }

        const commands = ctx.help.listCmd().reduce((prev, [_, value]) => {
          let command = value.values.join(",");
          let description = value.description;

          return `${prev}
  - ${command}: ${description}`;
        }, "");

        const options = ctx.help.listOpt().reduce((prev, [_, value]) => {
          let option = value.values.join(",");
          let prefix = "";
          let description = value.description;
          let suffix = "";

          if (value.defaultFn && value.default) {
            prefix = "[<optional>] ";
            suffix = ` (${value.defaultFn(value.default(ctx), ctx)})`;
          } else {
            prefix = "[<required>] ";
          }

          return `${prev}
  - ${option}: ${prefix}${description}${suffix}`;
        }, "");

        const help = `${ctx.name} usage
Commands: ${commands}
Options: ${options}`;
        ctx.logger.print(help);
      },
    })
    .build((res, ctx) => {
      ctx.debugResult(res);
    });

  // Commandline.init(ns)
  //   .default(["nuke"], __NAME__, __VERSION__, __BUILD_DATE__)
  //   .options(defineWhitelistOption())
  //   .options(defineBlacklistOption())
  //   .build(async (_, ctx) => {
  //     ctx.graph.walk(host => {
  //       ctx.logger.tdebug("processing %s", host);

  //       const server = ctx.ns.getServer(host);
  //       const hackingSkill = ns.getHackingLevel();

  //       const isHackable = server.requiredHackingSkill <= hackingSkill;
  //       if (!isHackable) {
  //         ctx.logger.debug(
  //           "%s require hacking skill too high (%d > %d)",
  //           host,
  //           server.requiredHackingSkill,f
  //           hackingSkill
  //         );
  //         return;
  //       }

  //       if (!server.hasAdminRights) {
  //         let requirePort = server.numOpenPortsRequired - server.openPortCount;
  //         if (ns.fileExists("BruteSSH.exe", "home")) {
  //           ns.brutessh(host);
  //           requirePort--;
  //         }

  //         if (ns.fileExists("relaySMTP.exe", "home")) {
  //           ns.relaysmtp(host);
  //           requirePort--;
  //         }

  //         if (ns.fileExists("FTPCrack.exe", "home")) {
  //           ns.ftpcrack(host);
  //           requirePort--;
  //         }

  //         if (ns.fileExists("HTTPWorm.exe", "home")) {
  //           ns.httpworm(host);
  //           requirePort--;
  //         }

  //         if (ns.fileExists("SQLInject.exe", "home")) {
  //           ns.sqlinject(host);
  //           requirePort--;
  //         }

  //         if (requirePort <= 0) {
  //           ns.nuke(host);
  //         } else {
  //           ctx.logger.debug(
  //             "%s require more port we can open (%d > %d)",
  //             host,
  //             server.numOpenPortsRequired,
  //             server.openPortCount
  //           );
  //           return;
  //         }
  //       }
  //     });
  //   });
};

export { main };
