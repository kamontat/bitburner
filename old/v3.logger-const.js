const LEVEL_DEBUG = "debug"
const LEVEL_INFO = "info"
const LEVEL_WARN = "warn"
const LEVEL_ERROR = "error"

/** @param {string} lvl */
function getLevels(lvl) {
	const level = lvl.toLowerCase()
	switch (level) {
		case LEVEL_ERROR: return [LEVEL_ERROR]
		case LEVEL_WARN: return [LEVEL_ERROR, LEVEL_WARN]
		case LEVEL_INFO: return [LEVEL_ERROR, LEVEL_WARN, LEVEL_INFO]
		case LEVEL_DEBUG: return [LEVEL_ERROR, LEVEL_WARN, LEVEL_INFO, LEVEL_DEBUG]
		default: return level.split(",")
	}

}

/**
 * return true if it should be logged to output.
 * 
 * @param {string[]} levels
 * @param {string} lvl
 */
function shouldLog(levels, lvl) {
	return levels.map(l => l.toLowerCase()).includes(lvl);	
}

export {
	getLevels,
	shouldLog,

	LEVEL_DEBUG,
	LEVEL_INFO,
	LEVEL_WARN,
	LEVEL_ERROR
}