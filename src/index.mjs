import stylelint from "stylelint";
import messages from "./lib/messages.mjs";

const ruleName = "@talkdesk/stylelint-no-exist-css-variable";

import {
	convertCustomVars,
	hasCustomPropertyReference,
} from "./lib/helper.mjs";

import validate from "./lib/validate.mjs";

const meta = {
	url: "https://github.com/TD-gaowei/stylelint-no-exist-css-variable/blob/main/README.md",
};

const isMethodEnabled = (method) => method === true;

const isMethodDisabled = (method) => method === null || method === false;

const ruleFunction = (primaryOption, secondaryOptionObject) => {
	// sources to import custom selectors from
	// const importFrom = [].concat(Object(opts).importFrom || []);
	// const resolver = Object(opts).resolver || {};

	const customProperties = convertCustomVars([
		...Object(secondaryOptionObject)?.words,
		...Object(secondaryOptionObject)?.ignoreWords,
	]);

	// promise any custom selectors are imported
	// const customPropertiesPromise = isMethodEnabled(method)
	// 	? getCustomPropertiesFromImports(importFrom, resolver)
	// 	: {};

	return (root, result) => {
		// validate the method
		const isMethodValid = stylelint.utils.validateOptions(result, ruleName, {
			actual: primaryOption,
			possible() {
				return (
					isMethodEnabled(primaryOption) || isMethodDisabled(primaryOption)
				);
			},
		});

		if (isMethodValid && isMethodEnabled(primaryOption)) {
			// all custom properties from the file and imports
			// const customProperties = Object.assign(
			// 	await customPropertiesPromise,
			// 	await getCustomPropertiesFromRoot(root, resolver),
			// );

			// validate the css root
			// validateResult(result, words);

			result.root.walkDecls((decl) => {
				if (hasCustomPropertyReference(decl)) {
					validate(decl, { result, customProperties });
				}
			});
		}
	};
};

export default stylelint.createPlugin(ruleName, ruleFunction);

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;
