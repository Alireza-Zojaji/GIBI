import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Box,
	Typography,
} from '@mui/material';
import LButton from '../Button/Button';
import toast from 'react-hot-toast';
import { useStakingPoolStore } from '../../../providers/staking-pool-provider';

type PlanOrderDialogProps = {
	refreshData: () => void;
	planId: number | undefined;
	order: number;
	setDialog: (state: number | undefined) => void;
};

const PlanOrderDialog: React.FC<PlanOrderDialogProps> = ({
	planId,
	order: pervOrder,
	setDialog,
	refreshData,
}) => {
	const [pending, setPending] = useState<boolean>(false);
	const [order, setOrder] = useState<number | ''>('');

	const poolStore = useStakingPoolStore();
	const setPlanOrder = poolStore((state) => state.setPlanOrder);

	const handleSubmit = async () => {
		setPending(true);

		const res = await setPlanOrder(planId || 0, Number(order));
		setPending(false);

		if (res == true) {
			toast.success(
				`Plan ${planId || 0} order successfully changed into ${order}`
			);
			setDialog(undefined);
			refreshData();
		}
	};

	useEffect(() => {
		setOrder(Number(pervOrder));
	}, [pervOrder]);

	return (
		<Dialog
			open={planId ? true : false}
			onClose={() => {
				if (!pending) {
					setDialog(undefined);
				}
			}}
		>
			<DialogTitle>Plan {planId}</DialogTitle>
			<DialogContent dividers>
				<Box display="flex" alignItems="center" gap={1}>
					<Typography>Order:</Typography>
					<TextField
						disabled={pending}
						type="number"
						value={order}
						color="primary"
						onChange={(e) => setOrder(Number(e.target.value) || '')}
						size="small"
						variant="outlined"
						sx={{
							input: {
								color: 'white',
							},
						}}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<LButton
					disabled={pending}
					onClick={() => setDialog(undefined)}
					color="primary"
				>
					Cancel
				</LButton>
				<LButton
					loading={pending}
					onClick={handleSubmit}
					color="primary"
					variant="contained"
				>
					Submit
				</LButton>
			</DialogActions>
		</Dialog>
	);
};

export default PlanOrderDialog;
