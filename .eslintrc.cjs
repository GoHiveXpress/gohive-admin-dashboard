/** @type {import("eslint").Linter.Config} */

const config = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "./tsconfig.json",
		warnOnUnsupportedTypeScriptVersion: false,
	},
	globals: {
		React: true,
		Response: true,
		Request: true,
	},
	env: {
		// "jest/globals": true,
		browser: true,
	},
	plugins: ["@typescript-eslint", "import", "prettier"],
	ignorePatterns: ["node_modules", "public", "dist", "coverage", "IneritaPages"],
	extends: [
		"airbnb",
		"eslint:recommended",
		"next",
		"next/core-web-vitals",
		"prettier",
		"plugin:@typescript-eslint/recommended-type-checked",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"plugin:tailwindcss/recommended",
		"plugin:eslint-comments/recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:prettier/recommended",
	],
	rules: {
		"@typescript-eslint/ban-tslint-comment": "off",
		"@typescript-eslint/ban-ts-comment": "off",
		"@typescript-eslint/array-type": "off",
		"@typescript-eslint/consistent-type-definitions": "off",
		"jsx-a11y/heading-has-content": "warn",
		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				prefer: "type-imports",
				fixStyle: "inline-type-imports",
			},
		],
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				argsIgnorePattern: "^_",
			},
		],
		"@typescript-eslint/require-await": "off",
		"@typescript-eslint/no-misused-promises": [
			"error",
			{
				checksVoidReturn: {
					attributes: false,
				},
			},
		],
		"prettier/prettier": [
			"error",
			{
				useTabs: true,
				tabWidth: 4,
				printWidth: 100,
				// trailingComma: "all",
			},
		],
		"jsx-a11y/control-has-associated-label": [
			2,
			{
				ignoreElements: ["th", "tr", "video"],
			},
		],
		"tailwindcss/no-custom-classname": "off",
		"eslint-comments/no-unused-disable": "error",
		"no-console": ["error", { allow: ["warn", "error"] }],
		"no-tabs": 0,
		"import/extensions": 0,
		"no-underscore-dangle": 0,
		"import/no-unresolved": 0,
		"import/no-anonymous-default-export": 0,
		"react/button-has-type": "off",
		"react/function-component-definition": "off",
		"react/prop-types": ["off"],
		"react/jsx-filename-extension": [
			1,
			{
				extensions: [".js", ".jsx", ".ts", ".tsx"],
			},
		],
		"react/react-in-jsx-scope": 0,
		"react/require-default-props": "off",
		"react/no-children-prop": "off",
		"jsx-a11y/label-has-associated-control": 0,
		"react/jsx-props-no-spreading": 0,
		"react/destructuring-assignment": 0,
		"jsx-a11y/anchor-is-valid": 0,
	},
	settings: {
		react: {
			version: "detect",
		},
		tailwindcss: {
			config: "tailwind.config.js",
		},
		"import/resolver": {
			node: {
				extensions: [".ts", ".tsx", ".d.ts", ".js", ".jsx", ".json", ".node"],
				paths: ".",
			},
			typescript: {
				project: "./tsconfig.json",
				alwaysTryTypes: true,
			},
		},
	},
};

module.exports = config;
