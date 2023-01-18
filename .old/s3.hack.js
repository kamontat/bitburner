/**
 * Hack script to target
 */

import { VERSION } from './libv3.constants.js'
import { Options } from './libv3.options.js'
import { Logger } from './libv3.logger.js'

/** @param {NS} ns */
export async function main(ns) {
	const log = new Logger(ns);
	log.enable("weaken", "grow", "hack")
	
	const options = Options.parse(ns.args);
	log.setLevel(options.optional("info", "log"))

	const target = options.require("target");
	const money = options.require("money");
	const security = options.require("security");

	const moneyThreshold = ns.getServerMaxMoney(target) * (money / 100);
	const securityThreshold = ns.getServerMinSecurityLevel(target) * ((100 + security) / 100);

	log.info("Running hack version=%s", VERSION);
	log.info("Hacking %s with money=%.2f%%, security=%.2f%%", target, money, security);
	log.info("Threshold money=%.2f, security=%.2f", moneyThreshold, securityThreshold);

	while (true) {
		const security = ns.getServerSecurityLevel(target)
		const money = ns.getServerMoneyAvailable(target)

		if (security > securityThreshold) {
			log.info("weaken because %.2f > %.2f", security, securityThreshold);
			await ns.weaken(target);
		} else if (money < moneyThreshold) {
			log.info("grow because %.2f < %.2f", money, moneyThreshold);
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}