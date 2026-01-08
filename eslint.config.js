/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import eslintConfigNext from "eslint-config-next";

export default [
	...eslintConfigNext(),
	{
		rules: {
			"react/react-in-jsx-scope": "off",
			"prettier/prettier": "error",

			// Allow Named Exports (Standard for Shadcn/Radix)
			"import/no-named-as-default": "off",
			"import/no-named-as-default-member": "off",
			"import/prefer-default-export": "off", // If you have this rule

			// Relax strict type checks for UI components (Shadcn uses complex types)
			"@typescript-eslint/no-explicit-any": "off",

			"import/order": [
				"error",
				{
					groups: [["builtin", "external", "internal"]],
					"newlines-between": "always",
				},
			],
		},
	},
];
