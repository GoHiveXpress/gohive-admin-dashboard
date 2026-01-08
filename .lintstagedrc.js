/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import path from "path";

const buildEslintCommand = (filenames) =>
	`next lint --fix --no-ignore --file ${filenames
		.map((f) => path.relative(process.cwd(), f))
		.join(" --file ")}`;

export default {
	"*.{js,jsx,ts,tsx}": [buildEslintCommand],
};