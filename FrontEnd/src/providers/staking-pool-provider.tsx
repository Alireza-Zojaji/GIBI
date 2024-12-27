// StakingPoolProvider.tsx
import React, { createContext, useContext } from 'react';
import { useAppKitProvider } from '@reown/appkit/react';
import { createStakingPoolStore } from '../store/useStakingPoolStore';

const StakingPoolContext = createContext<ReturnType<
	typeof createStakingPoolStore
> | null>(null);

export function StakingPoolProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { walletProvider } = useAppKitProvider('eip155');

	const store = React.useMemo(() => {
		// If wallet isn't connected, use fallback
		if (!walletProvider) {
			return createStakingPoolStore(undefined);
		}
		// Otherwise, use the signer-enabled wallet
		return createStakingPoolStore(walletProvider);
	}, [walletProvider]);

	return (
		<StakingPoolContext.Provider value={store}>
			{children}
		</StakingPoolContext.Provider>
	);
}

export function useStakingPoolStore() {
	const context = useContext(StakingPoolContext);
	if (!context) {
		throw new Error(
			'useStakingPoolStore must be used within <StakingPoolProvider>'
		);
	}
	return context;
}
