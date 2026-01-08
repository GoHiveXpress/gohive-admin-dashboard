/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-shadow */

import redirects from "./public/redirects.js";

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,

	eslint: {
		ignoreDuringBuilds: true,
	},

	typescript: {
		ignoreBuildErrors: true,
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

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "assets.vercel.com",
				port: "",
				pathname: "/image/upload/**",
			},
			{
				protocol: "https",
				hostname: "flowbite.com",
				port: "",
				pathname: "/docs/images/**",
			},
			{
				protocol: "https",
				hostname: "flowbite.s3.amazonaws.com",
				port: "",
				pathname: "/blocks/**",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "github.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "cloudflare-ipfs.com",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "api.multiavatar.com",
				port: "",
				pathname: "/**",
			},
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
