import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AppKitProvider } from './providers/appkit-provider.tsx';
import { ThemeProvider } from '@mui/material';
import theme from './theme/theme.ts';

createRoot(document.getElementById('root')!).render(
	<AppKitProvider>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</AppKitProvider>
);
