export const customPropertyReferenceRegExp = /(^|[^\w-])var\([\W\w]+\)/i;

// whether a declaration references a custom property
export const hasCustomPropertyReference = (decl) =>
	customPropertyReferenceRegExp.test(decl.value);

export function toKebabCase(str) {
	return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

export function convertCustomVars(words) {
	return words?.map((word) => `--${toKebabCase(word)}`);
}
