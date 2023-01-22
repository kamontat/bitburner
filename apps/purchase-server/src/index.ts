import {
  Commandline,
  Converter,
  Verifier,
} from "@kcbb-libs/commandline";

const main: MainFunction = async ns => {
  await Commandline.init(ns)
    .default([], __NAME__, __VERSION__, __BUILD_DATE__)
    .options({
      name: "ram",
      options: ["--ram", "-R"],
      default: ctx => ctx.ns.getPurchasedServerMaxRam(),
      convert: Converter.int,
      verify: Verifier.number("ram"),
    })
    .options({
      name: "prefix",
      options: ["--server-prefix", "-P"],
      convert: Converter.string,
      default: () => `server-`,
    })
    .options({
      name: "upgrade",
      options: ["--upgrade", "-U"],
      default: () => false,
      convert: Converter.bool,
    })
    .build(async (result, ctx) => {
      ctx.debugResult(result);

      let i = 0;
      while (i < ctx.ns.getPurchasedServerLimit()) {
        const hostname = result.options.prefix + i;

        // Already purchased
        if (ctx.ns.serverExists(hostname) && !result.options.upgrade) {
          ctx.logger.debug("Server %s already purchased", hostname);
          i++;
          continue;
        }

        const moneyAvail = ctx.ns.getServerMoneyAvailable("home");
        if (result.options.upgrade) {
          ctx.logger.debug("upgrading %s", hostname);
          const serverCost = ctx.ns.getPurchasedServerUpgradeCost(hostname, result.options.ram);
          if (moneyAvail > serverCost) {
            ctx.ns.upgradePurchasedServer(hostname, result.options.ram);
            ctx.logger.info("Upgraded server %s", hostname);
            i++;
          } else {
            ctx.logger.debug("Not enough money to upgrade (%.2f < %.2f)", moneyAvail, serverCost);
            await ctx.ns.sleep(1000);
          }
        } else {
          ctx.logger.debug("purchasing %s", hostname);
          const serverCost = ctx.ns.getPurchasedServerCost(result.options.ram);
          if (moneyAvail > serverCost) {
            ctx.ns.purchaseServer(hostname, result.options.ram);
            ctx.logger.info("purchased server %s", hostname);
            i++;
          } else {
            ctx.logger.debug("Not enough money to purchase (%.2f < %.2f)", moneyAvail, serverCost);
            await ctx.ns.sleep(1000);
          }
        }
      }
    });
};

export { main };
