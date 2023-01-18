/**
 * Deploy hack scripts to specify server or all servers.
 */

import { HACK_SCRIPT, LIBS } from './libv3.constants.js'
import { Options } from './libv3.options.js'
import { Logger } from './libv3.logger.js'
import { ServerTree } from './libv3.servers.js';

/** @param {NS} ns */
export async function main(ns) {
	const log = new Logger(ns);
	log.enable("exec")

	const options = Options.parse(ns.args);
	log.setLevel(options.optional("info", "log"))
	
	const whitelist = options.optional("", "server");
	const tree = ServerTree.scan(ns, whitelist && [whitelist]);

	const target = options.optional(tree.highest(ns).hostname, "target");
	const money = options.require("money");
	const security = options.require("security");

	tree.walk((hostname) => {
		const scriptRam = ns.getScriptRam(HACK_SCRIPT, "home");
		const server = ns.getServer(hostname);
		if (!server.hasAdminRights) {
			log.debug("Skipped %s because has no permission to deploy scripts", hostname)
			return;
		}

		const thread = Math.floor(server.maxRam / scriptRam);

		ns.scp(LIBS.concat(HACK_SCRIPT), server.hostname);
		ns.killall(server.hostname, true)
		ns.exec(HACK_SCRIPT, server.hostname, thread, "-T", target, "-M", money, "-S", security)
	})
}