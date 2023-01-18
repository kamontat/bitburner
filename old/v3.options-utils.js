/** @param {string[]} args */
function toMap(args) {
	const result = {
		values: [],
		raw: args,
	};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		if (!arg.startsWith("-")) {
			result.values.push(arg)
			continue;
		}

		const key = arg.replace("--", "").replace("-", "")
		const next = i < args.length - 1 ? args[i + 1] : undefined;
		if (next === undefined) {
			result[key] = true;
			break;
		} else if (next.toString().startsWith("-")) {
			result[key] = true;
		} else {
			result[key] = next;
			i++;
		}
	}

	return result;
}

export { toMap }