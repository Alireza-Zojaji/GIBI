import { useEffect, useState } from 'react';
import LButton from '../../components/ui/Button/Button';
import { Info, Investment, Plan } from '../../store/useStakingPoolStore';
import { transformIntoNormalNumber } from '../../utility/functions';
import { useAppKitAccount } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from '../../components/ui/CountDownTimer/CountDownTimer';
import toast from 'react-hot-toast';
import useConfirmationDialog from '../../hooks/useConfirmationDialog';
import { CircularProgress } from '@mui/material';
import GainTable from './GainTable';
import { useStakingPoolStore } from '../../providers/staking-pool-provider';

interface Data {
	gain: string;
	secondsToWithdraw: number;
	investments: Investment[];
	plans: Plan[];
	totalInfo: Info[];
}

export default function GainPageView() {
	const poolStore = useStakingPoolStore();
	const getGainValue = poolStore((state) => state.getGainValue);
	const receiveGain = poolStore((state) => state.receiveGain);
	const getSecondsToWithdraw = poolStore(
		(state) => state.getSecondsToWithdraw
	);
	const loading = poolStore((state) => state.loading);
	const getInvestments = poolStore((state) => state.getInvestments);
	const getPlans = poolStore((state) => state.getPlans);
	const getInfo = poolStore((state) => state.getInfo);
	const getWithdrawableValue = poolStore(
		(state) => state.getWithdrawableValue
	);
	const withdraw = poolStore((state) => state.withdraw);
	const { isConnected } = useAppKitAccount();
	const navigateTo = useNavigate();
	const [mainLoading, setMainLoading] = useState<boolean>(false);
	const [canWithdraw, setCanWithdraw] = useState<boolean>(false);
	const [canView, setCanView] = useState<boolean>(false);
	const [data, setData] = useState<Data>();
	const { dialogElement, openDialog, setLoading, closeDialog } =
		useConfirmationDialog();

	async function handleReceiveGain() {
		const confirm = await openDialog(
			'Are sure about collecting your profit ?'
		);
		if (confirm) {
			setLoading(true);
			const res = await receiveGain();
			setLoading(false);
			closeDialog();
			if (res) {
				toast.success(`You successfully gained ${data?.gain} GIBI`);
				fetchData();
			}
		}
	}

	async function handleWithdraw() {
		const confirm = await openDialog(
			'Are sure about withdrawing your GIBI ?'
		);
		if (confirm) {
			setLoading(true);
			const res = await withdraw();
			setLoading(false);
			closeDialog();
			if (res) {
				toast.success(`You successfully withdraw your GIBI`);
				fetchData();
			}
		}
	}

	async function checkIsOwner() {
		if (isConnected == false) {
			navigateTo('/');
			return false;
		}
		setCanView(true);
	}

	useEffect(() => {
		checkIsOwner();
		fetchData();
	}, [isConnected]);

	async function fetchData() {
		setMainLoading(true);
		const secondsToWithdraw = await getSecondsToWithdraw();
		const gainRes = await getGainValue();
		const investmentsRes = await getInvestments();
		const plansRes = await getPlans();
		const totalRes = await getInfo();
		const canWithdrawRes = await getWithdrawableValue();

		if (Number(canWithdrawRes) > 0) {
			setCanWithdraw(true);
		}

		console.log('investmentsRes:', investmentsRes);

		setData((prev) => ({
			...prev,
			gain: transformIntoNormalNumber(Number(gainRes), true),
			secondsToWithdraw: Number(secondsToWithdraw),
			investments:
				typeof investmentsRes == 'object' ? investmentsRes : [],
			plans: typeof plansRes == 'object' ? plansRes : [],
			totalInfo: typeof totalRes == 'object' ? totalRes : [],
		}));

		setMainLoading(false);
	}

	if (!canView) {
		return null;
	}

	return (
		<main className="w-full flex items-center flex-col gap-4">
			{dialogElement}
			<h1 className="outline-text">Gain</h1>
			<div className="flex flex-col gap-4">
				<h3 className="max-sm:text-center">
					Gain Values:{' '}
					<span className="text-nowrap">
						{loading.getGainValue || mainLoading ? (
							<CircularProgress size={26} />
						) : (
							data?.gain
						)}{' '}
						<span className="text-secondary-400">GIBI</span>{' '}
					</span>
				</h3>
				<LButton
					disabled={mainLoading || Number(data?.gain) == 0}
					className="mx-auto mb-8"
					onClick={handleReceiveGain}
					size="large"
					variant="contained"
				>
					Receive
				</LButton>
			</div>
			<h3>Time to Next Withdrawal:</h3>
			<CountdownTimer
				loading={mainLoading || loading.getSecondsToWithdraw}
				timerFinished={fetchData}
				initialSeconds={data?.secondsToWithdraw || 0}
			/>
			<LButton
				className="mt-1"
				onClick={handleWithdraw}
				disabled={!canWithdraw || mainLoading}
				size="large"
				variant="outlined"
			>
				Withdraw
			</LButton>
			<h1 className="outline-text mr-auto mt-2">Investments</h1>

			<GainTable
				investmentsData={data?.investments}
				loading={loading.getInvestments || mainLoading}
				plansData={data?.plans}
				totalInfo={data?.totalInfo}
			/>
		</main>
	);
}
