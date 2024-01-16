/** @type {import('tailwindcss').Config}*/
const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	plugins: [require('flowbite/plugin')],

	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				primary: {
					50: '#12051a',
					100: '#200b29',
					200: '#311337',
					300: '#431b46',
					400: '#562353'
				},
				blurple: '#5865F2'
			},
			fontFamily: {
				inter: ['"Inter"', 'sans-serif']
			}
		}
	}
};

module.exports = config;
