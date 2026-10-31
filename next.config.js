/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-shadow */

import { withSentryConfig } from "@sentry/nextjs/config";
import redirects from "./public/redirects.js";

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,

	// Next 14 needs this flag to run src/instrumentation.ts (Sentry server setup)
	experimental: {
		instrumentationHook: true,
	},

	// Lint still runs in the pre-commit hook on the files you change. Older files
	// have not been cleaned up yet, so a full lint would fail the build; flip this
	// once `next lint` is clean.
	eslint: {
		ignoreDuringBuilds: true,
	},

	// tsc is clean, so a type error now fails the build instead of shipping.
	typescript: {
		ignoreBuildErrors: false,
	},

	async redirects() {
		return redirects;
	},

	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/i,
			issuer: /\.[jt]sx?$/,
			use: [{ loader: "@svgr/webpack", options: { icon: true } }],
		});

		return config;
	},

	// Only hosts real images come from: Dojah (KYC) and Cloudinary (uploads).
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.dojah.io",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "/**",
			},
		],
	},
};

// Source maps upload only when SENTRY_AUTH_TOKEN, SENTRY_ORG and SENTRY_PROJECT are
// set in the build environment; without them the build still works.
export default withSentryConfig(config, {
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,
	authToken: process.env.SENTRY_AUTH_TOKEN,
	silent: !process.env.CI,
	sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
	telemetry: false,
});
