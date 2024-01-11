import defaultTheme from "tailwindcss/defaultTheme"

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
			sans: ["Alegreya Sans", ...defaultTheme.fontFamily.sans],
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
