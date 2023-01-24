import { Commandline, Defaults } from "@kcbb-libs/commandline";

const main: MainFunction = async ns => {
  await Commandline.init(ns)
    .options({
      key: "version",
      values: ["--version", "-v"],
      default: Defaults.constant(false),
    })
    .build();

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
  //           server.requiredHackingSkill,
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
