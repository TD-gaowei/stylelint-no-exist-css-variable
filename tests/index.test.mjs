import { testRule } from "stylelint-test-rule-node";
import plugin from "../src/index.mjs";

const {
	ruleName,
	rule: { messages },
} = plugin;

const plugins = [plugin];

// when config is null, this rule is not enabled
testRule({
	plugins,
	ruleName,
	config: null,
	accept: [
		{
			code: "body { color: var(--chat-bot); }",
			description: "ignored custom property",
		},
	],
});

// when config is true and pass in the second parameter, this rule will work
testRule({
	plugins,
	ruleName,
	config: [
		true,
		{
			words: ["chatBot", "chatTitleColor"],
			ignoreWords: [],
		},
	],
	accept: [
		{
			code: "body { color: var(--chat-bot); }",
			description: "used css variable",
		},
	],
});

//When the parameters passed in are incorrect, an error message will be displayed.
testRule({
	plugins,
	ruleName,
	config: [
		true,
		{
			words: ["chatBot1", "chatTitleColor"],
			ignoreWords: [],
		},
	],
	reject: [
		{
			code: "body { color: var(--chat-bot); }",
			description: "used css variable",
			message: messages.unexpected("--chat-bot"),
			line: 1,
			column: 19,
			endLine: 1,
			endColumn: 29,
		},
	],
});
