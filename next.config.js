/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-shadow */

import redirects from "./public/redirects.js";

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,

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

export default config;
