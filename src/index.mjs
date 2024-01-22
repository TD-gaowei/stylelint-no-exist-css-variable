import stylelint from "stylelint";
import valueParser from "postcss-value-parser";

import { convertCustomVars, hasCustomProperty } from "./lib/helper.mjs";

const ruleName = "@talkdesk/stylelint-no-exist-css-variable";

const meta = {
	url: "https://github.com/TD-gaowei/stylelint-no-exist-css-variable/blob/main/README.md",
};

const isVarFunc = (node) =>
	node.type === "function" &&
	node.value === "var" &&
	node.nodes[0].value.startsWith("--");

const messages = stylelint.utils.ruleMessages(ruleName, {
	unexpected: (name, prop) =>
		`Unexpected css variable "${name}" inside user's config.`,
});

const ruleFunction = (primaryOption, secondaryOptionObject, context) => {
	const words = secondaryOptionObject?.words || [];
	const ignoreWords = secondaryOptionObject?.ignoreWords || [];

	const customProperties = convertCustomVars([...words, ...ignoreWords]);

	return (postcssRoot, postcssResult) => {
		const validOptions = stylelint.utils.validateOptions(
			postcssResult,
			ruleName,
			{
				actual: primaryOption,
				possible() {
					return primaryOption === true || primaryOption === null;
				},
			},
			{
				actual: secondaryOptionObject,
				possible() {
					return (
						primaryOption === true && typeof secondaryOptionObject === "object"
					);
				},
			},
		);

		if (!validOptions) return;

		postcssRoot.walkDecls((decl) => {
			if (hasCustomProperty(decl)) {
				const parsed = valueParser(decl.value);

				parsed.walk((node) => {
					if (!isVarFunc(node)) return;

					const propertyName = node.nodes?.[0]?.value;

					if (customProperties.includes(propertyName)) {
						return;
					}

					stylelint.utils.report({
						message: messages.unexpected(propertyName, decl.prop),
						node: decl,
						result: postcssResult,
						ruleName,
						word: propertyName,
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
