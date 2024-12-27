export {};

declare global {
	interface EthereumProvider {
		request: (args: {
			method: string;
			params?: any[] | object;
		}) => Promise<any>;
	}

	interface Window {
		ethereum?: EthereumProvider;
	}
}
