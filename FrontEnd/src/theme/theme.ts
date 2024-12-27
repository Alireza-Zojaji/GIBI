// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#f9c720',
			contrastText: '#0e151b',
		},
		background: {
			default: '#1a2128',
			paper: '#1a2128',
		},
		text: {
			primary: '#ffffff',
		},
	},
	components: {
		MuiDialog: {
			styleOverrides: {
				paper: {
					backgroundColor: '#1a2128',
					color: 'white',
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					// Default border is white
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: 'white',
					},
					// Hover border also white
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: 'white',
					},
					// Focused border => primary color
					'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
						borderColor: '#f9c720',
					},
					// Default text color inside the input
					color: 'white',
				},
			},
		},
		MuiFormLabel: {
			styleOverrides: {
				root: {
					color: 'white',
					// Keep label white even when focused
					'&.Mui-focused': {
						color: 'white',
					},
				},
			},
		},
	},
});

export default theme;
