/**
 * Purchase new server if we have money.
 */

import { DEPLOY_SCRIPT } from './libv3.constants.js';
import { Options } from './libv3.options.js';
import { Logger } from './libv3.logger.js'
import { SERVER_PREFIX } from './libv3.servers.js';

/** @param {NS} ns */
export async function main(ns) {
	const log = new Logger(ns);
	log.enable("purchaseServer", "exec")
	
	const options = Options.parse(ns.args);
	log.setLevel(options.optional("info", "log"))

	const ram = options.optional(ns.getPurchasedServerMaxRam(), "ram");
	const target = options.optional("", "target");
	const money = options.optional(-1, "money");
	const security = options.optional(-1, "security");

	let i = 0;
	while (i < ns.getPurchasedServerLimit()) {
		const hostname = `${SERVER_PREFIX}-${i}`;
		// Already purchased
		if (ns.serverExists(hostname)) {
			i++;
			continue;
		}

		const moneyAvail = ns.getServerMoneyAvailable("home");
		const serverCost = ns.getPurchasedServerCost(ram);
		if (moneyAvail > serverCost) {
			log.info("Purchasing server %s", hostname);
			ns.purchaseServer(hostname, ram);

			if (target !== "" && money > 0 && security > 0) {
				ns.exec(DEPLOY_SCRIPT, "home", 1, "-T", target, "-M", money, "-S", security, "-E", hostname);
			}
			i++;
		} else {
			log.debug("Not enough money (%.2f < %.2f)", moneyAvail, serverCost)
			await ns.sleep(1000);
		}
	}
}