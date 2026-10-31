// vitest.config.ts
// Unit and component tests (npm test). Mirrors the tsconfig path aliases.
/* eslint-disable import/no-extraneous-dependencies */
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{ find: /^@\/env$/, replacement: fileURLToPath(new URL("./env.ts", import.meta.url)) },
			{ find: /^@\//, replacement: `${src}/` },
		],
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/__tests__/setup.ts"],
		include: ["src/**/*.test.{ts,tsx}"],
		css: false,
	},
});

/* eslint-enable */
