// eslint-disable-next-line no-undef
module.exports = {
	root: true,
	env: {
		browser: false,
		node: true,
		es2022: true,
	},
	parser: "@typescript-eslint/parser", // Используем TypeScript парсер
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	extends: [
		"eslint:recommended",            // Основные правила ESLint
		"plugin:@typescript-eslint/recommended", // Рекомендации TypeScript ESLint
		"plugin:prettier/recommended"
	],
	plugins: ["@typescript-eslint"],
	rules: {
		"no-console": "warn",
		"semi": ["error", "always"],
		'no-undef': 'off',
		'eslint-disable-next-line': 'off',
		"quotes": ["error", "double"],
		"@typescript-eslint/no-unused-vars": ["error"],
		'@typescript-eslint/no-explicit-any': [0],
		"prettier/prettier": 0
	},
};
