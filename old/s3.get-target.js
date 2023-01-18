/**
 * Get highest profix we have root access currently.
 */

import { Options } from './libv3.options.js'
import { Logger } from './libv3.logger.js'
import { ServerTree } from './libv3.servers.js';

/** @param {NS} ns */
export async function main(ns) {
	const log = new Logger(ns);
	log.enable()

	const options = Options.parse(ns.args);
	log.setLevel(options.optional("info", "log"))

	const tree = ServerTree.scan(ns);
	/** @type {Server} */
	let server = tree.highest(ns);

	log.info("Highest server profix is %s", server.hostname)
	log.info("  - money: %.2f/%.2f", server.moneyAvailable, server.moneyMax)
	log.info("  - money: %.2f/%.2f/%.2f", server.minDifficulty, server.hackDifficulty, server.baseDifficulty)
}