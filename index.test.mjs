import { testRule } from 'stylelint-test-rule-node';
import plugin from './src/index.mjs';

const rule = plugin.rule;
const messages = plugin.rule.messages;

let accept = [], reject = [];

/* Test disabled
/* ========================================================================== */

accept = [
	{ code: 'body { color: var(--brand-blue); }', description: 'ignored custom property' },
];

testRule({ plugins: ['.'], ruleName: rule.ruleName, config: null, accept });
