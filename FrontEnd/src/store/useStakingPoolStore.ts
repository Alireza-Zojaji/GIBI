import { create } from 'zustand';
import { BrowserProvider, Contract, JsonRpcProvider } from 'ethers';
import StakingPoolABI from '../abi/stakingpool-abi.json';
import GIBIABI from '../abi/gibi-abi.json';
import toast from 'react-hot-toast';
import BigNumber from 'bignumber.js';

export interface Plan {
	0: number; // duration
	1: number; // apy
	2: number; // order
	3: boolean; // active
	4: BigNumber; // minInvestment
	5: BigNumber; // investmentCount
	6: BigNumber; // investmentSum
	7: BigNumber; // gainSum
	8: BigNumber; // withdrawalSum
}

export interface Investment {
	0: number; // planId
	1: number; // time
	2: boolean; // withdrew
	3: boolean; // gainReceived
	4: BigNumber; // value
	5: BigNumber; // gain
}

export interface Info {
	0: number; // Investment Sum
	1: number; // GainReceived Sum
	2: boolean; // Withdrawal Sum
}

interface SystemInfo {
	0: BigNumber; // investorCount
	1: BigNumber; // investmentCount
	2: BigNumber; // totalInvestment
	3: BigNumber; // totalGainReceived
	4: BigNumber; // totalWithdrawal
	5: BigNumber; // currentInvestmentSum
	6: BigNumber; // availableTokenAmount
}

type LoadingKeys =
	| keyof Omit<StakingPoolStore, 'error' | 'poolContract' | 'loading'>
	| 'global';

type ErrorKeys =
	| keyof Omit<StakingPoolStore, 'error' | 'poolContract' | 'loading'>
	| 'global';

interface StakingPoolStore {
	tokenContract: Contract;
	poolContract: Contract;
	loading: Record<LoadingKeys, boolean>;
	error: Record<ErrorKeys, any>;

	// State updaters
	setLoading: (key: LoadingKeys, value: boolean) => void;
	setErrorMessage: (key: ErrorKeys, error: any) => void;

	// Contract calls
	getOwner: () => Promise<string | false>;
	amIOwner: () => Promise<boolean>;
	getAllPlans: () => Promise<Plan[] | false>;
	getPlans: () => Promise<Plan[] | boolean>;
	getInfo: () => Promise<Info[] | boolean>;
	getPlansInfo: () => Promise<Plan[] | boolean>;
	getPlanInfo: (planId: number) => Promise<Plan | false>;
	getInvestments: () => Promise<Investment[] | boolean>;
	getSystemInfo: () => Promise<SystemInfo | boolean | any[]>;
	getWithdrawableValue: () => Promise<BigNumber | false>;
	getGainValue: () => Promise<BigNumber | false>;
	getSecondsToWithdraw: () => Promise<number | false>;
	invest: (planId: number, value: BigInt) => Promise<boolean | void>;
	withdraw: () => Promise<boolean | void>;
	receiveGain: () => Promise<boolean | void>;
	activatePlan: (planId: number) => Promise<boolean | void>;
	deactivatePlan: (planId: number) => Promise<boolean | void>;
	addPlan: (
		duration: number,
		apy: number,
		order: number,
		minInvestment: string,
		active: boolean
	) => Promise<boolean | void>;
	setPlanOrder: (planId: number, order: number) => Promise<boolean | void>;
	changeOwner: (newOwner: string) => Promise<boolean | void>;
}

function unwrapProxies(proxyArray: any[]) {
	return proxyArray.map((proxy) => ({ ...proxy }));
}

function unwrapNormalProxies(proxyArray: any[]) {
	return Array.from(proxyArray).map((item: any) => item.toString());
}

// Instead of directly referencing window.ethereum,
// you can pass your 'walletProvider' from AppKit into this function.
export function createStakingPoolStore(walletProvider: any) {
	let provider;
	if (walletProvider) {
		provider = new BrowserProvider(walletProvider);
	} else {
		provider = new JsonRpcProvider('https://mainnet.base.org');
	}

	// 2) Return a Zustand store that uses this `provider`
	return create<StakingPoolStore>((set, get) => ({
		loading: { global: false } as Record<LoadingKeys, boolean>,
		error: {} as Record<ErrorKeys, any>,

		// Instantiate the contracts with your own environment variables
		poolContract: new Contract(
			import.meta.env.VITE_STAKING_POOL_CONTRACT_ADDRESS,
			StakingPoolABI,
			provider
		),

		tokenContract: new Contract(
			import.meta.env.VITE_GIBI_CONTRACT_ADDRESS,
			GIBIABI,
			provider
		),

		// --- Utility setErrorMessage ---
		setErrorMessage: (key: ErrorKeys, error: any) => {
			let errorMessage = 'An unknown error occurred';
			if (error?.reason) {
				errorMessage = error.reason;
			} else if (error?.message) {
				errorMessage = error.message;
			}
			toast.error(errorMessage);

			set((state) => ({
				error: { ...state.error, [key]: errorMessage },
			}));

			setTimeout(() => {
				set((state) => ({
					error: { ...state.error, [key]: undefined },
				}));
			}, 3000);
		},

		// --- Utility setLoading ---
		setLoading: (key: LoadingKeys, value: boolean) => {
			set((state) => {
				const updatedLoading = { ...state.loading, [key]: value };
				// If any non-global key is set to true => global is true
				const isGlobalTrue = Object.entries(updatedLoading)
					.filter(([k]) => k !== 'global')
					.some(([, v]) => v === true);

				return {
					loading: {
						...updatedLoading,
						global: isGlobalTrue,
					},
				};
			});
		},

		// --- Contract calls ---
		getOwner: async () => {
			try {
				get().setLoading('getOwner', true);
				const signer = await provider.getSigner();
				return await (
					get().poolContract.connect(signer) as any
				).getOwner();
			} catch (error) {
				get().setErrorMessage('getOwner', error);
				return false;
			} finally {
				get().setLoading('getOwner', false);
			}
		},

		amIOwner: async () => {
			try {
				get().setLoading('amIOwner', true);
				const signer = await provider.getSigner();
				return await (
					get().poolContract.connect(signer) as any
				).amIOwner();
			} catch (error) {
				//get().setErrorMessage('amIOwner', error);
				return false;
			} finally {
				get().setLoading('amIOwner', false);
			}
		},

		getAllPlans: async () => {
			try {
				get().setLoading('getAllPlans', true);
				const signer = await provider.getSigner();
				return await (
					get().poolContract.connect(signer) as any
				).getAllPlans();
			} catch (error) {
				get().setErrorMessage('getAllPlans', error);
				return false;
			} finally {
				get().setLoading('getAllPlans', false);
			}
		},

		getPlans: async () => {
			try {
				get().setLoading('getPlans', true);
				// for read-only calls, no need to connect(signer) if contract is not restricted
				const res = await get().poolContract.getPlans();
				return unwrapProxies(res);
			} catch (error) {
				get().setErrorMessage('getPlans', error);
				return false;
			} finally {
				get().setLoading('getPlans', false);
			}
		},

		getInfo: async () => {
			try {
				get().setLoading('getInfo', true);
				const signer = await provider.getSigner();
				const res = await (
					get().poolContract.connect(signer) as any
				).getInfo();
				return unwrapNormalProxies(res);
			} catch (error) {
				get().setErrorMessage('getInfo', error);
				return false;
			} finally {
				get().setLoading('getInfo', false);
			}
		},

		getPlansInfo: async () => {
			try {
				get().setLoading('getPlansInfo', true);
				const signer = await provider.getSigner();
				const plansInfo = await (
					get().poolContract.connect(signer) as any
				).getPlansInfo();
				return unwrapProxies(plansInfo);
			} catch (error) {
				get().setErrorMessage('getPlansInfo', error);
				return false;
			} finally {
				get().setLoading('getPlansInfo', false);
			}
		},

		getPlanInfo: async (planId: number) => {
			try {
				get().setLoading('getPlanInfo', true);
				const signer = await provider.getSigner();
				return await (
					get().poolContract.connect(signer) as any
				).getPlanInfo(planId);
			} catch (error) {
				get().setErrorMessage('getPlanInfo', error);
				return false;
			} finally {
				get().setLoading('getPlanInfo', false);
			}
		},

		getInvestments: async () => {
			try {
				get().setLoading('getInvestments', true);
				const signer = await provider.getSigner();
				const res = await (
					get().poolContract.connect(signer) as any
				).getInvestments();
				return unwrapProxies(res);
			} catch (error) {
				get().setErrorMessage('getInvestments', error);
				return false;
			} finally {
				get().setLoading('getInvestments', false);
			}
		},

		getSystemInfo: async () => {
			try {
				get().setLoading('getSystemInfo', true);
				const signer = await provider.getSigner();
				const res = await (
					get().poolContract.connect(signer) as any
				).getSystemInfo();
				return unwrapNormalProxies(res);
			} catch (error) {
				get().setErrorMessage('getSystemInfo', error);
				return false;
			} finally {
				get().setLoading('getSystemInfo', false);
			}
		},

		getWithdrawableValue: async () => {
			try {
				get().setLoading('getWithdrawableValue', true);
				const signer = await provider.getSigner();
				return await (
					get().poolContract.connect(signer) as any
				).getWithdrawableValue();
			} catch (error) {
				get().setErrorMessage('getWithdrawableValue', error);
				return false;
			} finally {
				get().setLoading('getWithdrawableValue', false);
			}
		},

		getGainValue: async () => {
			try {
				get().setLoading('getGainValue', true);
				const signer = await provider.getSigner();
				return await (
					get().poolContract.connect(signer) as any
				).getGainValue();
			} catch (error) {
				get().setErrorMessage('getGainValue', error);
				return false;
			} finally {
				get().setLoading('getGainValue', false);
			}
		},

		getSecondsToWithdraw: async () => {
			try {
				get().setLoading('getSecondsToWithdraw', true);
				const signer = await provider.getSigner();
				return await (
					get().poolContract.connect(signer) as any
				).getSecondsToWithdraw();
			} catch (error) {
				get().setErrorMessage('getSecondsToWithdraw', error);
				return false;
			} finally {
				get().setLoading('getSecondsToWithdraw', false);
			}
		},

		invest: async (planId, value) => {
			const { setLoading, setErrorMessage, tokenContract, poolContract } =
				get();
			const signer = await provider.getSigner();
			setLoading('invest', true);

			try {
				const poolAddress = await poolContract.getAddress();
				const ownerAddress = await signer.getAddress();
				const tokenContractWithSigner = tokenContract.connect(
					signer
				) as any;
				const poolContractWithSigner = poolContract.connect(
					signer
				) as any;

				const currentAllowance = await tokenContract.allowance(
					ownerAddress,
					poolAddress
				);
				if (currentAllowance < value) {
					const approveTx = await tokenContractWithSigner.approve(
						poolAddress,
						value
					);
					await approveTx.wait();
				}

				// staticCall for sanity check
				await poolContractWithSigner.invest.staticCall(planId, value);

				// actual tx
				const investTx = await poolContractWithSigner.invest(
					planId,
					value
				);
				await investTx.wait();

				return true;
			} catch (error) {
				setErrorMessage('invest', error);
				return false;
			} finally {
				setLoading('invest', false);
			}
		},

		withdraw: async () => {
			try {
				get().setLoading('withdraw', true);
				const signer = await provider.getSigner();
				const contractWithSigner = get().poolContract.connect(
					signer
				) as any;

				await contractWithSigner.withdraw.staticCall();
				const tx = await contractWithSigner.withdraw();
				await tx.wait();
				return true;
			} catch (error) {
				get().setErrorMessage('withdraw', error);
				return false;
			} finally {
				get().setLoading('withdraw', false);
			}
		},

		receiveGain: async () => {
			try {
				get().setLoading('receiveGain', true);
				const signer = await provider.getSigner();
				const contractWithSigner = get().poolContract.connect(
					signer
				) as any;

				await contractWithSigner.receiveGain.staticCall();
				const tx = await contractWithSigner.receiveGain();
				await tx.wait();
				return true;
			} catch (error) {
				get().setErrorMessage('receiveGain', error);
				return false;
			} finally {
				get().setLoading('receiveGain', false);
			}
		},

		activatePlan: async (planId: number) => {
			try {
				get().setLoading('activatePlan', true);
				const signer = await provider.getSigner();
				const contractWithSigner = get().poolContract.connect(
					signer
				) as any;

				await contractWithSigner.activatePlan.staticCall(planId);
				const tx = await contractWithSigner.activatePlan(planId);
				await tx.wait();

				return true;
			} catch (error) {
				get().setErrorMessage('activatePlan', error);
				return false;
			} finally {
				get().setLoading('activatePlan', false);
			}
		},

		deactivatePlan: async (planId: number) => {
			try {
				get().setLoading('deactivatePlan', true);
				const signer = await provider.getSigner();
				const contractWithSigner = get().poolContract.connect(
					signer
				) as any;

				await contractWithSigner.deactivatePlan.staticCall(planId);
				const tx = await contractWithSigner.deactivatePlan(planId);
				await tx.wait();

				return true;
			} catch (error) {
				get().setErrorMessage('deactivatePlan', error);
				return false;
			} finally {
				get().setLoading('deactivatePlan', false);
			}
		},

		addPlan: async (duration, apy, order, minInvestment, active) => {
			try {
				get().setLoading('addPlan', true);
				const signer = await provider.getSigner();
				const contractWithSigner = get().poolContract.connect(
					signer
				) as any;

				await contractWithSigner.addPlan.staticCall(
					duration,
					apy,
					order,
					minInvestment,
					active
				);
				const tx = await contractWithSigner.addPlan(
					duration,
					apy,
					order,
					minInvestment,
					active
				);
				await tx.wait();

				return true;
			} catch (error) {
				get().setErrorMessage('addPlan', error);
				return false;
			} finally {
				get().setLoading('addPlan', false);
			}
		},

		setPlanOrder: async (planId, order) => {
			try {
				get().setLoading('setPlanOrder', true);
				const signer = await provider.getSigner();
				const contractWithSigner = get().poolContract.connect(
					signer
				) as any;

				await contractWithSigner.setPlanOrder.staticCall(planId, order);
				const tx = await contractWithSigner.setPlanOrder(planId, order);
				await tx.wait();

				return true;
			} catch (error) {
				get().setErrorMessage('setPlanOrder', error);
				return false;
			} finally {
				get().setLoading('setPlanOrder', false);
			}
		},

		changeOwner: async (newOwner) => {
			try {
				get().setLoading('changeOwner', true);
				const signer = await provider.getSigner();
				const contractWithSigner = get().poolContract.connect(
					signer
				) as any;

				await contractWithSigner.changeOwner.staticCall(newOwner);
				const tx = await contractWithSigner.changeOwner(newOwner);
				await tx.wait();

				return true;
			} catch (error) {
				get().setErrorMessage('changeOwner', error);
				return false;
			} finally {
				get().setLoading('changeOwner', false);
			}
		},
	}));
}
