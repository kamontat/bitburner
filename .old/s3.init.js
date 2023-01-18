/**
 * Initiate root access to server.
 */

import { Core } from 'v3.core-lib.js'

/** @param {NS} ns */
export async function main(ns) {
	/** @type {import("v3.core-lib.js")} */
	const core = new Core(ns);

	ns.print(core)
}


// import { DEPLOY_SCRIPT } from './libv3.constants.js'
// import { Options } from './libv3.options.js'
// import { Logger } from './libv3.logger.js'
// import { ServerTree } from './libv3.servers.js';

// /** @param {NS} ns */
// export async function main(ns) {
// 	const log = new Logger(ns);
// 	log.enable("brutessh", "relaysmtp", "ftpcrack", "httpworm", "sqlinject", "nuke", "exec")

// 	const options = Options.parse(ns.args);
// 	log.setLevel(options.optional("info", "log"))

// 	const target = options.optional("", "target");
// 	const money = options.optional(-1, "money");
// 	const security = options.optional(-1, "security");
// 	const whitelist = options.optional("", "server");

// 	const tree = ServerTree.scan(ns, whitelist && [whitelist]);
// 	tree.walk((hostname) => {
// 		const server = ns.getServer(hostname);
// 		const hackingSkill = ns.getHackingLevel()
// 		const isHackable = server.requiredHackingSkill <= hackingSkill;

// 		if (!isHackable) {
// 			log.warn("%s require hacking skill too high (%d > %d)", hostname, server.requiredHackingSkill, hackingSkill)
// 			return;
// 		}

// 		if (!server.hasAdminRights) {
// 			let requirePort = server.numOpenPortsRequired - server.openPortCount;

// 			if (ns.fileExists("BruteSSH.exe", "home")) {
// 				ns.brutessh(hostname);
// 				requirePort--;
// 			}

// 			if (ns.fileExists("relaySMTP.exe", "home")) {
// 				ns.relaysmtp(hostname);
// 				requirePort--;
// 			}

// 			if (ns.fileExists("FTPCrack.exe", "home")) {
// 				ns.ftpcrack(hostname);
// 				requirePort--;
// 			}

// 			if (ns.fileExists("HTTPWorm.exe", "home")) {
// 				ns.httpworm(hostname);
// 				requirePort--;
// 			}

// 			if (ns.fileExists("SQLInject.exe", "home")) {
// 				ns.sqlinject(hostname);
// 				requirePort--;
// 			}

// 			if (requirePort <= 0) {
// 				ns.nuke(hostname)
// 			} else {
// 				log.warn("cannot nuke server %s because no enough program to open port", hostname)
// 				return;
// 			}
// 		}

// 		if (target !== "" && money > 0 && security > 0) {
// 			ns.exec(DEPLOY_SCRIPT, "home", 1, "-T", target, "-M", money, "-S", security, "-E", whitelist);
// 		}
// 	})
// }