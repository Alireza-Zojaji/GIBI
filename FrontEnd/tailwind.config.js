// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			screens: {
				'850px': '850px',
			},
			colors: {
				primary: {
					100: '#1a2128',
					200: '#151b21',
					300: '#12171c',
					400: '#0e1217',
					500: '#0e151b', // Base color
					600: '#0b1014',
					700: '#080c0f',
					800: '#05080a',
					900: '#030405',
				},
				secondary: {
					100: '#fdeca6',
					200: '#fce086',
					300: '#fbd464',
					400: '#fac944',
					500: '#f9c720', // Base color
					600: '#d6a81a',
					700: '#b38814',
					800: '#8f690f',
					900: '#6c4a0a',
				},
			},
		},
	},
	plugins: [],
};
