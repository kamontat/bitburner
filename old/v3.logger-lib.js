import { getLevels, shouldLog, LEVEL_ERROR, LEVEL_WARN, LEVEL_INFO, LEVEL_DEBUG } from "./v3.logger-const.js"

class Logger {
	/** @param {NS} ns */
	static init(ns) {
		return new Logger(ns)
	}

	/** @param {NS} ns */
	constructor(ns) {
		this._ns = ns
		this._levels = []
	}

	/** @param {string[]} names */
	enable(...names) {
		this._ns.disableLog("ALL")
		for (const name of names) {
			this._ns.enableLog(name)
		}
	}

	/** @param {string} level */
	setLevel(level) {
		this._levels = getLevels(level)
	}

	/**
	 * @param {string} level
	 * @param {string} format
	 * @param {any[]} args
	 */
	_terminal(level, format, ...args) {
		if (shouldLog(this._levels, level))
			this._ns.tprintf(format, ...args)
	}

	/**
	 * @param {string} level
	 * @param {string} format
	 * @param {any[]} args
	 */
	_log(level, format, ...args) {
		if (shouldLog(this._levels, level))
			this._ns.printf(format, ...args)
	}

	tdebug(format, ...args) {
		this._terminal(LEVEL_DEBUG, format, ...args)
	}

	tinfo(format, ...args) {
		this._terminal(LEVEL_INFO, format, ...args)
	}

	twarn(format, ...args) {
		this._terminal(LEVEL_WARN, format, ...args)
	}

	terror(format, ...args) {
		this._terminal(LEVEL_ERROR, format, ...args)
	}

	debug(format, ...args) {
		this._log(LEVEL_DEBUG, format, ...args)
	}

	info(format, ...args) {
		this._log(LEVEL_INFO, format, ...args)
	}

	warn(format, ...args) {
		this._log(LEVEL_WARN, format, ...args)
	}

	error(format, ...args) {
		this._log(LEVEL_ERROR, format, ...args)
	}
}

export { Logger }