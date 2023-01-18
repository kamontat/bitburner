const SERVER_PREFIX = "serv"

const SERVER_DATA = "_data"
const SERVER_DATA_ENABLED = "enabled"
const SERVER_DATA_HOSTNAME = "hostname"

// If you specify whitelist list,
// the walker will return only this servers and it's connections
// If you specify blacklist list,
// the walker will filter this servers and it's connections out.
function walk(obj, cb, whitelist, blacklist, prev = []) {
	// Data will be null on tree root
	const data = obj[SERVER_DATA];
	const isEnabled = data ? data[SERVER_DATA_ENABLED] : false;
	const hostname = data ? data[SERVER_DATA_HOSTNAME] : "";
	const isBlacklist = blacklist.length > 0 && hostname !== "" ? blacklist.includes(hostname) : false;

	if (!isBlacklist) {
		if (isEnabled) {
			const current = prev[prev.length - 1];
			const isWhitelist = whitelist.length > 0 && hostname !== "" ? whitelist.includes(current) : true;
			if (isWhitelist) cb(current, prev);
		}

		const hostnames = Object.keys(obj).filter(key => key !== SERVER_DATA);
		hostnames.forEach(h => walk(obj[h], cb, whitelist, blacklist, prev.concat(h)))
	}
}

function getOwnedServers(prefix, limit) {
	const tree = {};
	for (let i = 0; i < limit; i++) {
		const hostname = `${prefix}-${i}`;
		tree[hostname] = true;
	}
	return tree;
}

/**
 * @param {NS} ns
 * @param {string} host
 */
function recursiveScan(ns, host, traveled = {}) {
	const result = {}
	const _connected = ns.scan(host);
	const connected = _connected.filter(c => !traveled[c])
	traveled[host] = true;

	if (connected.length === 0) return {
		[SERVER_DATA]: {
			[SERVER_DATA_HOSTNAME]: host,
			[SERVER_DATA_ENABLED]: true
		}
	};

	for (const next of connected) {
		const value = recursiveScan(ns, next, traveled);
		if (value !== undefined) {
			result[next] = {
				...value,
				[SERVER_DATA]: {
					[SERVER_DATA_HOSTNAME]: next,
					[SERVER_DATA_ENABLED]: true
				},
			};
		}
	}

	return result;
}

// Server tree must be
// Tree = Record<string, Tree | boolean>
class ServerTree {
	/**
	 * Use scan to return all servers tree
	 * @param {NS} ns
	 */
	static scan(ns, whitelist = [], blacklist = []) {
		const tree = recursiveScan(ns, "home");
		return new ServerTree(tree, whitelist, blacklist);
	}

	/**
	 * use prefix and limit to return our owned servers tree
	 * @param {NS} ns
	 */
	static owned(ns, whitelist = [], blacklist = []) {
		const limit = ns.getPurchasedServerLimit();
		const tree = getOwnedServers(SERVER_PREFIX, limit);
		return new ServerTree(tree, whitelist, blacklist);
	}

	// manual create server tree
	static manual(tree, whitelist = [], blacklist = []) {
		return new ServerTree(tree, whitelist, blacklist);
	}

	/**
	 * @param {string} prefix - owned server prefix
	 * @param {number} limit - maximum server owned, from ns.getPurchasedServerLimit() 
	 */
	constructor(tree, whitelist = [], blacklist = []) {
		this._tree = tree;
		this._whitelist = whitelist ? whitelist : [];
		this._blacklist = blacklist ? blacklist : [];
	}

	walk(cb) {
		walk(this._tree, cb, this._whitelist, this._blacklist);
	}

	/**
	 * @param {NS} ns
	 * @return {Server}
	 */
	highest(ns) {
		let highestServer;
		let highestMoney = 0;
		this.walk((hostname) => {
			const server = ns.getServer(hostname);
			if (!server.hasAdminRights) {
				return;
			}

			if (server.moneyAvailable > highestMoney) {
				highestMoney = server.moneyAvailable;
				highestServer = server
			}
		})
		return highestServer;
	}

	toTreeString() {
		return JSON.stringify(this._tree);
	}

	toString() {
		return `${this._whitelist}, ${this._blacklist}, ${this.toTreeString()}`
	}
}

export { ServerTree, SERVER_PREFIX }