import { CircularProgress, TextField } from '@mui/material';
import LButton from '../../components/ui/Button/Button';
import { transformIntoNormalNumber } from '../../utility/functions';
import { useRef } from 'react';
import toast from 'react-hot-toast';
import useConfirmationDialog from '../../hooks/useConfirmationDialog';
import { useStakingPoolStore } from '../../providers/staking-pool-provider';

export default function InvestCard({
	loading,
	data,
}: {
	loading: boolean;
	data?: any;
}) {
	const { openDialog, dialogElement, closeDialog, setLoading } =
		useConfirmationDialog();
	const poolStore = useStakingPoolStore();
	const invest = poolStore((state) => state.invest);
	const investRef = useRef<any>();

	async function handleInvestClick() {
		if (!investRef.current) {
			return false;
		}
		const enteredValue = Number(investRef.current?.value);
		const minimumInvestment = transformIntoNormalNumber(Number(data[5]));

		console.log('enteredValue:', enteredValue);

		if (Number(enteredValue) < Number(minimumInvestment)) {
			toast.error('Investment value is less than the minimum required.');
			return;
		}

		const investmentBigInt = BigInt(
			parseFloat(String(enteredValue)) * 10 ** 18
		);

		console.log('investmentBigInt:', investmentBigInt);

		const res = await openDialog(
			`Are you sure about investing ${enteredValue} GIBI in "Plan ${data[3]}"`,
			{ autoClose: false }
		);

		//const investmentBigInt = BigInt(enteredValue) * 10n ** 18n;

		if (res) {
			setLoading(true);
			const investRes = await invest(Number(data[0]), investmentBigInt);
			setLoading(false);
			if (investRes) {
				toast.success(
					`Congratulations, ${enteredValue} GIBI invested successfully in "Plan ${data[3]}"`
				);
			}
			closeDialog();
		}
	}

	return (
		<div className="flex flex-col min-w-[300px] gap-3 p-4 border rounded-xl bg-primary-300">
			{dialogElement}
			<h3 className="text-center">Plan {String(data[3])}</h3>
			{(!loading && (
				<>
					<p className="text-lg text-secondary-400">
						<span className="text-white">Days:</span>{' '}
						{Number(data[1]) / 86400}
					</p>
					<p className="text-lg text-secondary-400">
						<span className="text-white">Annual Gain:</span>{' '}
						{Number(data[2])}%
					</p>
					<p className="text-secondary-500 mt-3 text-center text-lg font-semibold">
						Amount
					</p>
					<div className="flex relative gap-2 justify-center items-center">
						<TextField
							className='w-1/2'
							inputRef={investRef}
							type="number"
							size="small"
							disabled={loading}
						/>
						<p className="text-nowrap">GIBI</p>
						<p className="absolute -bottom-[1.1rem] left-[3.3rem] text-xs text-secondary-400">
							Min Investment:{' '}
							{transformIntoNormalNumber(Number(data[5]))} GIBI
						</p>
					</div>
					<LButton
						onClick={handleInvestClick}
						className="!mx-auto mt-5"
						variant="contained"
					>
						Invest
					</LButton>
				</>
			)) || (
				<div className="w-full h-[20dvh] flex items-center justify-center">
					<CircularProgress />
				</div>
			)}
		</div>
	);
}
