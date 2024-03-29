import defaultTheme from "tailwindcss/defaultTheme"
import typography from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			// https://tailwindcss.com/docs/typography-plugin#customizing-the-css
			typography: {
				DEFAULT: {
					css: {
						lineHeight: 1.5,
						code: {
							backgroundColor: "#f5f5f5",
							borderRadius: "3px",
							padding: ".2rem",
							fontWeight: "400",
						},
						// Remove backticks
						// https://github.com/tailwindlabs/tailwindcss-typography/issues/18
						"code::before": {
							content: '""'
						},
						"code::after": {
							content: '""'
						},
					},
				},
			}
		},
		fontFamily: {
			sans: ["Alegreya Sans", ...defaultTheme.fontFamily.sans],
		},
	},
	plugins: [
		typography,
	],
}
