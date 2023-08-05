/** @type {import('tailwindcss').Config}*/
const config = {
	content: [
	  "./src/**/*.{html,js,svelte,ts}",
	  "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	],
  
	plugins: [
	  require('flowbite/plugin')
	],
  
	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				primary: {
					50: '#11001C',
					100: '#290025',
					200: '#35012C',
					300: '#4F0147',
					400: '#3A015C'
				},
				blurple: '#5865F2'
			},
			fontFamily: {
			  'inter': ['"Inter"', 'sans-serif'],
			}
		}
	}
};

module.exports = config;
