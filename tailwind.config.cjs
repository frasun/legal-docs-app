/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	safelist: [
		'grid-cols-2',
		'grid-cols-3',
		'grid-cols-4',
		'grid-cols-5',
		'grid-cols-6',
		'grid-cols-7',
		'grid-cols-8',
		'grid-cols-9',
		'grid-cols-10',
	],
	theme: {
		spacing: {
			0: '0',
			5: '0.3125rem',
			8: '0.5rem',
			10: '0.625rem',
			15: '0.9375rem',
			20: '1.25rem',
			30: '1.875rem',
			40: '2.5rem',
			60: '3.75rem'
		},
		colors: {
			transparent: 'transparent',
			active: '#EA271B',
			black: '#282725',
			white: '#fff',
			orange: '#FFE1B4',
			yellow: '#FFFFB8',
			red: '#FFC9C6',
			green: '#C1F988',
			blue: '#B0FAFF',
			purple: '#F4C6FF',
		},
		fontFamily: {
			sans: ['IBM Plex', 'ui-sans-serif', 'sans-serif'],
			serif: ['Lora', 'Georgia', 'ui-serif', 'serif'],
		},
		borderRadius: {
			sm: '3px',
			DEFAULT: '6px',
			xl: '15px',
		},
		boxShadow: ({ theme }) => ({
			1: `0 1px ${theme('colors.black')}1a`,
			2: `0 2px ${theme('colors.black')}1a`,
			3: `0 3px ${theme('colors.black')}1a`,
			inner: 'inset 0 1px',
			none: 'none',
		}),
		container: theme => ({
			center: true,
			padding: {
				DEFAULT: theme('spacing.20'),
				lg: theme('spacing.30')
			}
		}),
		screens: {
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'xxl': '1360px',
			'3xl': '1440px',
		},
		extend: {
			zIndex: {
				menu: 9998,
				max: 9999,
				loader: 99999
			},
			typography: theme => ({
				DEFAULT: {
					css: {
						'--tw-prose-headings': theme('colors.black'),
						'--tw-prose-bullets': theme('colors.black'),
						'--tw-prose-counters': theme('colors.black'),
						'--tw-prose-body': theme('colors.black'),
						maxWidth: 'none',
						fontFamily: theme('fontFamily.serif').join(),
						fontSize: '1.0625rem',
						lineHeight: '1.47em',
						color: `${theme('colors.black')}b3`,
						'h1, h2, h3, h4': {
							fontFamily: theme('fontFamily.serif').join(),
							fontStyle: 'italic',
							fontWeight: '500',
							marginTop: '1.5em',
							'@media (min-width: 768px)': {
								marginTop: '1.75em',
							}
						},
						h1: {
							fontSize: '1.65rem',
							lineHeight: '1.28em',
							'@media (min-width: 768px)': {
								fontSize: '1.75rem',
							}
						},
						h2: {
							fontSize: '1.5rem',
							lineHeight: '1.3em'
						},
						h3: {
							fontSize: '1.25rem',
							lineHeight: '1.3em',
						},
						h4: {
							fontSize: '1.125rem',
							lineHeight: '1.2em',
						},
						'h4, h3 + h4': {
							marginTop: '2em'
						},
						'strong, em': {
							fontFamily: theme('fontFamily.serif').join(),
							fontWeight: '700',
							fontStyle: 'italic',
							color: theme('colors.black')
						},
						a: {
							textDecoration: 'none'
						}
					}
				},
				document: {
					css: {
						'--tw-prose-headings': theme('colors.black'),
						'--tw-prose-bullets': theme('colors.black'),
						'--tw-prose-counters': theme('colors.black'),
						'--tw-prose-body': theme('colors.black'),
						h3: {
							fontFamily: theme('fontFamily.serif').join(),
							fontStyle: 'italic',
							fontWeight: '500',
							lineHeight: '1.28em',
							marginTop: '1.2em',
							fontSize: '1.25rem',
							'@media (min-width: 768px)': {
								fontSize: '1.75rem',
							}
						},
						h4: {
							fontFamily: theme('fontFamily.serif').join(),
							fontWeight: '700',
							fontStyle: 'italic',
							fontSize: '0.9375rem',
							lineHeight: '1.2em',
						},
						'h4, h3 + h4': {
							marginTop: '2em'
						},
						ol: {
							paddingLeft: '1em',
							'@media (min-width: 768px)': {
								paddingLeft: '2.5em'
							}
						},
						'br + p': {
							marginTop: 0
						}
					}
				}
			})
		}
	},
	plugins: [
		plugin(function ({ addComponents, addUtilities, theme }) {
			const textItalic = {
				fontFamily: theme('fontFamily.serif'),
				fontStyle: 'italic',
				fontWeight: '500'
			}
			const textSerif = {
				fontFamily: theme('fontFamily.serif'),
				fontWeight: '500'
			}
			const textSerifBold = {
				fontFamily: theme('fontFamily.serif'),
				fontWeight: '700'
			}
			const textSans = {
				fontFamily: theme('fontFamily.sans'),
				fontWeight: '500',
				letterSpacing: '-.01em'
			}

			const textSerifMd = {
				fontSize: '1.0625rem',
				lineHeight: '1.47em',
			}
			const textSerifSm = {
				fontSize: '0.9375rem',
				lineHeight: '1.2em',
			}

			const textSansSm = {
				...textSans,
				fontSize: '0.9375rem',
				lineHeight: '1.33em',
			}
			const textSansMd = {
				...textSans,
				fontSize: '0.9375rem',
				lineHeight: '1.33em',
			}
			const textSansXl = {
				...textSans,
				fontSize: '1.125rem',
				lineHeight: '1.36em',
			}

			const textItalicLg = {
				...textItalic,
				fontSize: '1.75rem',
				lineHeight: '1.28em',
			}

			addUtilities({
				// text styles				
				'.text-italic-xl': {
					...textItalic,
					fontSize: '2rem',
					lineHeight: '1.25em',
				},
				'.text-italic-lg': textItalicLg,
				'.text-italic-md': {
					...textItalic,
					fontSize: '1.25rem',
					lineHeight: '1.3em',
				},
				'.text-italic-sm': {
					...textItalic,
					fontSize: '1.125rem',
					lineHeight: '1.22em',
				},
				'.text-italic-xs': {
					...textItalic,
					fontSize: '0.9375rem',
					lineHeight: '1.125em',
				},
				'.text-serif-md': {
					...textSerif,
					...textSerifMd
				},
				'.text-serif-md-bold': {
					...textSerifBold,
					...textSerifMd
				},
				'.text-serif-sm': {
					...textSerif,
					...textSerifSm
				},
				'.text-serif-sm-bold': {
					...textSerifBold,
					...textSerifSm
				},
				'.text-sans-xxl': {
					...textSans,
					fontSize: '1.375rem',
					lineHeight: '1.2em',
				},
				'.text-sans-xl': textSansXl,
				'.text-sans-lg': {
					...textSans,
					fontSize: '1rem',
					lineHeight: '1.33em',
				},
				'.text-sans-md': textSansMd,
				'.text-sans-sm': textSansSm,
				'.text-sans-xs': {
					...textSans,
					fontSize: '0.8125rem',
					lineHeight: '1.3em',
				},
				'.text-sans-xxs': {
					...textSans,
					fontSize: '0.75rem',
					lineHeight: '1.33em',
				},
			}),
				addComponents({
					// buttons
					'.btn': {
						...textSansMd,
						padding: `${theme('spacing.8')} ${theme('spacing.15')}`,
						borderRadius: theme('borderRadius.sm'),
						color: theme('colors.black'),
						cursor: 'pointer',
						border: `1px solid ${theme('colors.black')}`,
						boxShadow: theme('boxShadow.2'),
						transitionProperty: theme('transitionProperty.DEFAULT'),
						transitionDuration: theme('transitionDuration.DEFAULT'),
						transitionTimingFunction: theme('transitionTimingFunction.DEFAULT'),
						display: 'flex',
						gap: theme('spacing.8'),
						alignItems: 'center',
						justifyContent: 'center',
						'&:disabled': {
							opacity: .3,
							pointerEvents: 'none'
						},
						'&:hover svg': {
							color: theme('colors.active')
						}
					},
					'.btn-default': {
						backgroundColor: theme('colors.black'),
						color: theme('colors.white'),
						'&:hover': {
							borderColor: theme('colors.active'),
							backgroundColor: theme('colors.active'),
							color: theme('colors.white'),
						},
					},
					'.btn-alt': {
						backgroundColor: theme('colors.transparent'),
						color: theme('colors.black'),
						'&:hover': {
							borderColor: theme('colors.active'),
							color: theme('colors.active'),
						},
					},
					'.btn-big': {
						...textSansXl,
						padding: `${theme('spacing.8')} ${theme('spacing.20')}`,
						borderRadius: theme('borderRadius.DEFAULT'),
						borderWidth: '2px',
						boxShadow: theme('boxShadow.3'),
					},
					'.btn-icon': {
						padding: `${theme('spacing.8')} ${theme('spacing.10')}`,
					},
					// menu item
					'.menu-item': {
						display: 'flex',
						alignItems: 'center',
						gap: theme('spacing.10'),
						padding: `${theme('spacing.10')} ${theme('spacing.10')}`,
						borderRadius: theme('borderRadius.sm'),
						...textSansMd,
						color: theme('colors.black'),
						lineHeight: '24px',
						'&:hover': {
							backgroundColor: `${theme('colors.black')}08`,
						},
						'@media (min-width: 1024px)': {
							padding: `${theme('spacing.10')} ${theme('spacing.15')}`,
						},
					},
					'.menu-item-sm': {
						...textSansSm
					}
				})
		}),
		require('@tailwindcss/forms')({
			strategy: 'base'
		}),
		require('@tailwindcss/typography'),
	],
}
