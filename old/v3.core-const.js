const VERSION = "v3";

const DEPLOY_SCRIPT = "s3.deploy.js";
const GET_TARGET_SCRIPT = "s3.get-target.js";
const HACK_SCRIPT = "s3.hack.js";
const INIT_SCRIPT = "s3.init.js";
const PURCHASE_SCRIPT = "s3.purchase.js";

const SCRIPTS = [
	DEPLOY_SCRIPT,
	GET_TARGET_SCRIPT,
	HACK_SCRIPT,
	INIT_SCRIPT,
	PURCHASE_SCRIPT,
]

const LIBS = [
	"v3.core-const.js",
	"v3.core-lib.js",
	"v3.logger-const.js",
	"v3.logger-lib.js",
	"v3.options-lib.js",
	"v3.options-utils.js",
	"v3.server-const.js",
	"v3.server-lib.js",
]

export {
	VERSION,
	DEPLOY_SCRIPT,
	GET_TARGET_SCRIPT,
	HACK_SCRIPT,
	INIT_SCRIPT,
	PURCHASE_SCRIPT,
	SCRIPTS,
	LIBS
}