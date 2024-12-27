import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useEffect } from 'react';
import { ethers } from 'ethers';
import gibiAbi from '../abi/gibi-abi.json';

const GIBI_TOKEN = {
	type: 'ERC20',
	options: {
		address: import.meta.env.VITE_GIBI_CONTRACT_ADDRESS,
		symbol: 'GIBI',
		decimals: 18,
		image: 'https://i.ibb.co/QQCqSzz/aqouff.jpg',
	},
	abi: gibiAbi,
};

const TOKEN_ADDED_STORAGE_KEY = 'gibi_token_added_status';

async function addTokenToWallet() {
	if (!window.ethereum) {
		console.error('Ethereum provider not found');
		return;
	}

	try {
		const provider = new ethers.BrowserProvider(window.ethereum as any);
		const signer = await provider.getSigner();
		const walletAddress = await signer.getAddress();

		// Check localStorage for this wallet's token status
		const tokenStatus = JSON.parse(
			localStorage.getItem(TOKEN_ADDED_STORAGE_KEY) || '{}'
		);

		if (tokenStatus[walletAddress]) {
			console.log('Token already added for this wallet.');
			return;
		}

		// Prompt user to add the token
		const wasAdded = await (window.ethereum as any)?.request({
			method: 'wallet_watchAsset',
			params: {
				type: GIBI_TOKEN.type,
				options: GIBI_TOKEN.options,
			},
		});

		if (wasAdded) {
			console.log('Token added successfully');
			tokenStatus[walletAddress] = true;
			localStorage.setItem(
				TOKEN_ADDED_STORAGE_KEY,
				JSON.stringify(tokenStatus)
			);

			console.log('Token appears to be added already');
		} else {
			console.log('Token addition rejected by user');
		}
	} catch (error) {
		console.error('Error checking or adding token:', error);
	}
}

export function WalletConnectionHandler() {
	const { isConnected } = useAccount();
	const chainId = useChainId();
	const { switchChain } = useSwitchChain();
	const envChain = import.meta.env.VITE_CHAIN_ID;

	useEffect(() => {
		if (isConnected && chainId && envChain && chainId !== envChain) {
			console.log(
				'Wrong chain detected. Attempting to switch to the correct network.'
			);
			switchChain({ chainId: envChain });
		}
	}, [isConnected, chainId, envChain, switchChain]);

	useEffect(() => {
		if (isConnected) {
			addTokenToWallet();
		}
	}, [isConnected]);

	return null;
}
