import defaultTheme from "tailwindcss/defaultTheme"
import typography from "@tailwindcss/typography"
import type { PluginAPI } from "tailwindcss/types/config"

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			// https://tailwindcss.com/docs/typography-plugin#customizing-the-css
			typography: (theme: PluginAPI["theme"]) => ({
				DEFAULT: {
					css: {
						lineHeight: 1.5,
						code: {
							backgroundColor: theme("colors.gray.100"),
							borderRadius: "3px",
							padding: ".1rem",
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
			})
		},
		fontFamily: {
			sans: ["Fira Sans", ...defaultTheme.fontFamily.sans],
			heading: ["Source Serif Pro", ...defaultTheme.fontFamily.serif]
		},
	},
	plugins: [
		typography,
	],
}
