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
				primary:{ 
					dark: {
						50: "#020309",
						100: "#070a18",
						150: "#101428",
						200: "#1c1e39",
						250: "#29294b",
						300: "#37355e",
						350: "#463f70",
						400: "#574b84",
						450: "#695697",
						1000: "#ddbffc",
						1050: "#edd2fd",
						1100: "#fae7ff"						
					},
					light: {
						50: "#d9deec",
						100: "#c7cde1",
						150: "#b5bdd9",
						200: "#a6abcf",
						250: "#989ac4",
						300: "#8a8ab9",
						350: "#7e78ae",
						400: "#7367a3",
						450: "#695696",
						1000: "#140023",
						1050: "#07010c",
						1100: "#010002"
					},
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
