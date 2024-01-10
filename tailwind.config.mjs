import defaultTheme from "tailwindcss/defaultTheme"
import plugin from "tailwindcss/plugin"

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
					},
				},
			}
		},
		fontFamily: {
			sans: ["Alegreya Sans", "Libre Franklin", ...defaultTheme.fontFamily.sans],
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		/*
		Change the base font size because Alegreya is a bit smaller than the standard fonts (e.g. Arial)
		https://design2tailwind.com/blog/change-tailwindcss-base-font-size/
		 */
		plugin(function({ addBase }) {
			addBase({
			   'html': {fontSize: "1.125rem" },
			 })
		   }),
	],
}
