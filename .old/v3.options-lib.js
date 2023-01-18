import { toMap } from './v3.options-utils.js'

class Options {
	/** @param {NS} ns */
	static init(ns) {
		return new Options(toMap(ns.args))
	}

	static get server() {
		return ["server", "E"]
	}

	static get target() {
		return ["target", "T"]
	}

	static get money() {
		return ["money-percentage", "M"]
	}

	static get security() {
		return ["security-percentage", "S"]
	}

	static get interval() {
		return ["interval", "I"]
	}

	static get ram() {
		return ["ram", "R"]
	}

	static get log() {
		return ["log-level", "L"]
	}

	/** 
	 * @param {Record<string, string | boolean | number>} mapper 
	 * @param {{
	 * 		[key: string]: {
	 * 			"options": string[],
	 * 			"required": boolean,
	 * 			"defaultFn": () => string | boolean | number	
	 * 		}	
	 * }} fields
	 */
	constructor(mapper, fields) {
		this._mapper = mapper
		this._fields = fields;
	}

	/** @param {string} key */
	get(key) {
		const data = this._fields[key]
		if (data === undefined) throw new Error(`Invalid key (${key}) from allowed fields`)

		const isRequire = data["required"]
		const options = data["options"]

		let result = this._get(isRequire, ...options)
		if (!isRequire) {
			result = result ?? data["defaultFn"]()
		}

		return result
	}

	/** @return {Record<string, string | boolean | number>} */
	getAll() {
		return Object.keys(this._fields).reduce((result, key) => {
			result[key] = this.get(key)
			return result;
		}, {})
	}

	/**
	 * @param {boolean} require
	 * @param {string[]} fields
	 * 
	 * @return {string | number | boolean | undefined}
	 */
	_get(require, ...fields) {
		for (const field of fields) {
			const value = this._mapper[field];
			if (value !== undefined && value !== null) return value
		}

		if (require)
			throw new Error(`missing require either fields [${fields}]`)
		return undefined;
	}
}

export { Options }