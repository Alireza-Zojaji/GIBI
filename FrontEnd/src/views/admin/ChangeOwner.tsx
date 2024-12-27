import { TextField } from '@mui/material';
import { useRef } from 'react';
import LButton from '../../components/ui/Button/Button';
import { useStakingPoolStore } from '../../providers/staking-pool-provider';
import useConfirmationDialog from '../../hooks/useConfirmationDialog';
import toast from 'react-hot-toast';
import { isAddress } from 'ethers';

export default function ChangeOwner() {
	const investRef = useRef<any>();
	const { dialogElement, openDialog, setLoading, closeDialog } =
		useConfirmationDialog();
	const poolStore = useStakingPoolStore();
	const changeOwner = poolStore((state) => state.changeOwner);

	async function handleChangeOwnerClick() {
		if (!investRef.current) {
			return false;
		}

		const enteredValue = String(investRef.current?.value);

		if (enteredValue.length === 0) {
			return toast.error('Please enter a wallet address.');
		}

		if (!isAddress(enteredValue)) {
			return toast.error(
				'The entered value is not a valid wallet address.'
			);
		}

		const confirm = await openDialog(
			'Are you sure you want to change the contract owner to the address provided? This action is irreversible.',
			{ autoClose: false }
		);
		if (confirm) {
			setLoading(true);
			const changeOwnerRes = await changeOwner(enteredValue);
			setLoading(false);
			closeDialog();
			if (changeOwnerRes) {
				toast.success(
					'Contract ownership has been successfully transferred to the new address!'
				);
				location.reload();
			}
		}
	}

	return (
		<main className="flex flex-col gap-3 mt-8">
			{dialogElement}
			<h1 className="outline-text flex items-center gap-4">
				Change Owner
			</h1>
			<div className="flex gap-6 items-center lg:ps-12">
				<TextField
					placeholder="New Owner Wallet Address"
					className="w-full sm:w-2/3 lg:w-5/12"
					inputRef={investRef}
					type="text"
					size="small"
				/>
				<LButton
					onClick={handleChangeOwnerClick}
					className="max-sm:scale-[0.82]"
					variant="contained"
				>
					Change Owner
				</LButton>
			</div>
		</main>
	);
}
