import { Logger } from './v3.logger-lib.js'
import { Options } from './v3.options-lib.js'

class Core {
	/** @param {NS} ns */
	static new(ns) {
		return new Core(ns);
	}

	/** @param {NS} ns */
	constructor(ns) {
		this._ns = ns

		this._logger = undefined;
		this._options = undefined;
	}

	initLogger() {
		this._logger = Logger.init(this._ns);
		return this;
	}

	get logger() {
		if (this._logger === undefined) throw new Error("Please call initLogger() before use logger");
		return this._logger;
	}

	initOptions() {
		this._options = Options.init(this._ns);
		return this;
	}

	get options() {
		if (this._options === undefined) throw new Error("Please call initOptions() before use options");
		return this._options;
	}
}

export { Core }