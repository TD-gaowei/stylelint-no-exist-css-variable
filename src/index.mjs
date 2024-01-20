import stylelint from "stylelint";
import valueParser from "postcss-value-parser";

import {
	convertCustomVars,
	hasCustomPropertyReference,
} from "./lib/helper.mjs";

const ruleName = "@talkdesk/stylelint-no-exist-css-variable";

const meta = {
	url: "https://github.com/TD-gaowei/stylelint-no-exist-css-variable/blob/main/README.md",
};

const isMethodEnabled = (method) => method === true;

const isMethodDisabled = (method) => method === null || method === false;

const isVarFunc = (node) =>
	node.type === "function" &&
	node.value === "var" &&
	node.nodes[0].value.startsWith("--");

const messages = stylelint.utils.ruleMessages(ruleName, {
	unexpected: (name, prop) =>
		`not found css variable "${name}" inside declaration "${prop}".`,
});

const ruleFunction = (primaryOption, secondaryOptionObject, context) => {
	const customProperties = convertCustomVars([
		...Object(secondaryOptionObject)?.words,
		...Object(secondaryOptionObject)?.ignoreWords,
	]);

	return (postcssRoot, postcssResult) => {
		const validOptions = stylelint.utils.validateOptions(
			postcssResult,
			ruleName,
			{
				actual: primaryOption,
				possible() {
					return (
						isMethodEnabled(primaryOption) || isMethodDisabled(primaryOption)
					);
				},
			},
		);

		if (!validOptions) return;

		postcssRoot.walkDecls((decl) => {
			if (hasCustomPropertyReference(decl)) {
				const parsed = valueParser(decl.value);

				parsed.walk((node) => {
					if (!isVarFunc(node)) return;

					const [propertyNode, , ...fallbacks] = node.nodes;
					const propertyName = propertyNode.value;

					if (customProperties.includes(propertyName)) {
						return;
					}

					stylelint.utils.report({
						message: messages.unexpected(propertyName, decl.prop),
						node: decl,
						result: postcssResult,
						ruleName,
						word: String(propertyName),
					});
				});
			}
		});
	};
};

export default stylelint.createPlugin(ruleName, ruleFunction);

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;
