/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {		
		spacing: {
			0: '0',
			10: '.625rem',
			15: '.9375rem',
			20: '1.25rem',
			30: '1.875rem',
			40: '2.5rem',
			50: '3.125rem',
			60: '3.75rem',
			80: '5rem'
		},
		colors: {
			white: '#fff',
			white95: 'rgba(255, 255, 255, .95)',
			light: '#FDFDFC',
			gray: '#F5F3EE',			
			orange: '#EE544A',
			orangeDark: '#EA271B',
			yellow: 'rgba(255, 199, 90, 0.2)',
			dark90: 'rgba(40, 39, 37, 0.9)',
			dark75: 'rgba(40, 39, 37, 0.75)',
			dark65: 'rgba(40, 39, 37, 0.65)',
			dark55: 'rgba(40, 39, 37, 0.55)',
			dark40: 'rgba(40, 39, 37, 0.40)',
			dark30: 'rgba(40, 39, 37, 0.30)',
			dark10: 'rgba(40, 39, 37, 0.1)',
			transparent: 'rgba(255, 255, 255, 0)'
		},
		fontFamily: {
			sans: ['Chivo', 'ui-sans-serif', 'sans-serif'],
			serif: ['Bitter', 'ui-serif', 'Georgia','"Times New Roman"', 'Times', 'serif'],
		},
		fontSize: {
			xxs: ['0.8125rem', { lineHeight: '1.25em' }], //12
			xs: ['0.875rem', { lineHeight: '1rem' }], //14
			sm: ['0.9375rem', { lineHeight: '1.25rem' }], //15
			base: ['1rem', { lineHeight: '1.5rem' }], //16
			lg: ['1.0625rem', { lineHeight: '1.5rem' }], //17
			xl: ['1.125rem', { lineHeight: '1.5rem' }], //18
			'h3': ['1.3125rem', { lineHeight: '1.35' }], //21
			'2xl': ['1.63rem', { lineHeight: '1.3' }], //24
			'3xl': ['1.88rem'],
			'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
			'5xl': ['3rem', { lineHeight: '1' }],
			'6xl': ['3.75rem', { lineHeight: '1' }],
			'7xl': ['4.5rem', { lineHeight: '1' }],
			'8xl': ['6rem', { lineHeight: '1' }],
			'9xl': ['8rem', { lineHeight: '1' }],
		},
		fontWeight: {
			normal: '400',
      		medium: '500',
			bold: '700',
		},
		letterSpacing: {
			tighter: '-.02em',
			tight: '-.01em',
			normal: '0'
		},
		borderRadius: {
			sm: '3px',
			DEFAULT: '6px',
			lg: '10px',
			xl: '15px',
			'full': '50%'
		},
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
			'xxl': '1360px'
		  },
		extend: {
		zIndex: {
			max: 9999,
			}
		}
	},
	plugins: [
		// plugin(function({ addBase, theme }) {
		// 	addBase({			
		// 		'a': {
		// 			color: theme('colors.dark55'),
		// 			'&:hover': {
		// 				color: theme('colors.orange')
		// 			}
		// 		}
		// 	})
		//   }),
		  plugin(function({ addComponents, theme }) {
			addComponents({
				'.btn': {
					padding: '.5rem .625rem',
					display: 'inline-flex',
					borderRadius: theme('borderRadius.DEFAULT'),
					fontSize: theme('fontSize.sm'),
					lineHeight: theme('lineHeight.tight'),
					fontWeight: theme('fontWeight.bold'),
					letterSpacing: theme('letterSpacing.tighter'),
					color: theme('colors.white95'),
					'&:hover': {
						backgroundColor: theme('colors.orange'),
						color: theme('colors.white'),
					},
					'&:active': {
						backgroundColor: theme('colors.orangeDark')
					}
				},
				'.btn-default': {
					backgroundColor: theme('colors.dark90'),
					color: theme('colors.white95'),
			  	},
			  	'.btn-alt': {
					backgroundColor: theme('colors.dark10'),
					color: theme('colors.dark65'),				
			  	},
				'.btn-big': {
					fontSize: theme('fontSize.xl'),					
					padding: '.5rem 1.125rem',
					borderRadius: theme('borderRadius.lg')
				}
			})
		  }),
		require('@tailwindcss/forms')({
			strategy: 'base'
		})
	],
}
