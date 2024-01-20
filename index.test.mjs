import { testRule } from "stylelint-test-rule-node";
import plugin from "./src/index.mjs";

const rule = plugin.rule;
const messages = plugin.rule.messages;

let accept = [],
	reject = [];

accept = [
	{
		code: "body { color: var(--chat-bot); }",
		description: "ignored custom property",
	},
];

testRule({
	plugins: ["."],
	ruleName: rule.ruleName,
	config: [
		true,
		{
			words: ["chatBot", "chatTitleColor"],
			ignoreWords: [],
		},
	],
	accept,
});
