import stylelint from "stylelint";
import valueParser from "postcss-value-parser";

import ruleName from "./rule-name.mjs";
import messages from "./messages.mjs";

const isVarFunc = (node) =>
	node.type === "function" &&
	node.value === "var" &&
	node.nodes[0].value.startsWith("--");

export default function validate(decl, { result, customProperties }) {
	const parsed = valueParser(decl.value);

	parsed.walk((node) => {
		if (!isVarFunc(node)) return;
		const [propertyNode, , ...fallbacks] = node.nodes;
		const propertyName = propertyNode.value;

		console.log(11111111111, propertyName, 2222222222, customProperties);

		if (customProperties.includes(propertyName)) {
			return;
		}

		// conditionally test fallbacks
		// if (fallbacks.length) {
		// 	validateValueAST(
		// 		{ nodes: fallbacks.filter(isVarFunction) },
		// 		{ result, customProperties, decl },
		// 	);
		//
		// 	return;
		// }

		// report unknown custom properties
		stylelint.utils.report({
			message: messages.unexpected(propertyName, decl.prop),
			node: decl,
			result,
			ruleName,
			word: String(propertyName),
		});
	});
}
