/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

/**
 * Next.js redirect configuration
 * @see https://nextjs.org/docs/app/api-reference/next-config-js/redirects
 */

const redirects = [
	{
		source: "/layout",
		destination: "/layout",
		permanent: true, // or false if it's temporary
	},
	{
		source: "/old-about",
		destination: "/about-us",
		permanent: false,
	},
];

export default redirects;