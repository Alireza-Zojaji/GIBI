import { WagmiProvider } from 'wagmi';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from '@reown/appkit/networks';
import { ReactElement } from 'react';
import { WalletConnectionHandler } from './appkit-connection';
import { Toaster } from 'react-hot-toast';
import { StakingPoolProvider } from './staking-pool-provider';

const queryClient = new QueryClient();
const projectId = '0145104ef1bdaabe0414ea54d9b57109';

const wagmiAdapter = new WagmiAdapter({
	networks: [base],
	projectId,
	ssr: true,
});

createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks: [base],
	features: {
		socials: false,
		email: false,
	},
});

export function AppKitProvider({ children }: { children: ReactElement }) {
	return (
		<WagmiProvider config={wagmiAdapter.wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<WalletConnectionHandler />
				<Toaster />
				<StakingPoolProvider>{children}</StakingPoolProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
