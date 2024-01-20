import stylelint from "stylelint";
import ruleName from "./rule-name.mjs";

const messages = stylelint.utils.ruleMessages(ruleName, {
	unexpected: (name, prop) =>
		`not found css variable "${name}" inside declaration "${prop}".`,
});

export default messages;
