import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HiCheck, HiX } from 'react-icons/hi';

import CustomeTable from '../../components/ui/Table/CustomTable';
import useConfirmationDialog from '../../hooks/useConfirmationDialog';
import PlanOrderDialog from '../../components/ui/dialogs/PlanOrderDialog';
import LButton from '../../components/ui/Button/Button';

// import the needed store hooks

import { transformIntoNormalNumber } from '../../utility/functions';
import { useStakingPoolStore } from '../../providers/staking-pool-provider';

interface AdminPlansTableProps {
	plansData: any; // or more specific type if known
	refreshData: () => void; // function to refresh data in parent
	loading?: boolean; // optional loading state
}

export default function AdminPlansTable({
	plansData,
	refreshData,
	loading = false,
}: AdminPlansTableProps) {
	const [orderPlanId, setOrderPlanId] = useState<number | undefined>(
		undefined
	);
	const [orderPlanOrder, setOrderPlanOrder] = useState<number>(0);
	const [pendingTransaction, setPendingTransaction] =
		useState<boolean>(false);
	const [rows, setRows] = useState<Array<any>>([]);

	const poolStore = useStakingPoolStore();
	const activatePlan = poolStore((state) => state.activatePlan);
	const deactivatePlan = poolStore((state) => state.deactivatePlan);

	const { dialogElement, openDialog, setLoading, closeDialog } =
		useConfirmationDialog();

	// Rebuild rows whenever plansData changes
	useEffect(() => {
		if (!plansData) return;

		// Convert to an array and optionally skip the first entry
		const plansArray = Object.values(plansData).slice(1);

		const newRows = plansArray.map((plan: any, index: number) => [
			<div
				className="w-full flex items-center justify-center text-white text-2xl 850px:text-lg"
				key={`name-${index}`}
			>
				Plan {index + 1}
			</div>,
			Math.round(Number(plan[1]) / 86400) + ' days', // Duration
			String(plan[2]) + '%', // Apy
			String(plan[3]), // Order
			transformIntoNormalNumber(plan[5]), // Min Investment
			<div
				className="text-2xl 850px:w-full 850px:flex 850px:items-center 850px:justify-center"
				key={`status-${index}`}
			>
				{plan[4] ? <HiCheck /> : <HiX />}
			</div>,
			<div
				className="flex w-full gap-3 justify-center"
				key={`actions-${index}`}
			>
				<LButton
					loading={pendingTransaction}
					onClick={() =>
						handleChangeActivationClick(index + 1, plan[4])
					}
					variant="outlined"
					color="primary"
				>
					{plan[4] === false ? 'Activate' : 'Deactivate'}
				</LButton>
				<LButton
					loading={pendingTransaction}
					onClick={() => {
						setOrderPlanOrder(plan[3]);
						setOrderPlanId(plan[0]);
					}}
					variant="outlined"
					color="primary"
				>
					Edit
				</LButton>
			</div>,
		]);

		setRows(newRows);
	}, [plansData]);

	async function handleChangeActivationClick(
		planId: number,
		isActive: boolean
	) {
		// Show a confirmation dialog before activating/deactivating
		const confirmRes = await openDialog(
			`Are you sure about ${
				isActive ? 'di' : ''
			}activing "Plan ${planId}"?`,
			{ autoClose: false }
		);

		if (confirmRes) {
			setPendingTransaction(true);
			setLoading(true);
			let result;
			if (isActive) {
				result = await deactivatePlan(planId);
			} else {
				result = await activatePlan(planId);
			}

			closeDialog();

			if (result == true) {
				toast.success(
					`Plan ${planId} ${
						isActive ? 'de' : ''
					}activated successfully`
				);
				refreshData();
			}

			setPendingTransaction(false);
			setLoading(false);
		}
	}

	return (
		<>
			{dialogElement}
			<div className="850px:px-8">
				<CustomeTable
					pageSize={5}
					loading={loading}
					headers={[
						'',
						'Duration',
						'Apy',
						'Order',
						'Min Investment',
						'Active',
						'',
					]}
					rows={rows}
				/>
			</div>

			<PlanOrderDialog
				refreshData={refreshData}
				planId={orderPlanId}
				order={orderPlanOrder}
				setDialog={setOrderPlanId}
			/>
		</>
	);
}
