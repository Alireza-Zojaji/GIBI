import { Button } from '@mui/material';
import { useState, useEffect } from 'react';

import AdminPlansTable from './AdminPlansTable';
import NewPlanDialog from '../../components/ui/dialogs/newPlanDialog';
import AdminStatisticsText from '../../components/containers/admin/statistics-text';
import AdminStatisticsPlans from '../../components/containers/admin/statistics-plans';
import { useAppKitAccount } from '@reown/appkit/react';
import { useNavigate } from 'react-router-dom';
import ChangeOwner from './ChangeOwner';
import { useStakingPoolStore } from '../../providers/staking-pool-provider';

export default function AdminPageView() {
	const { isConnected } = useAppKitAccount();
	const [newPlanDialog, setNewPlanDialog] = useState(false);
	const [plansData, setPlansData] = useState<any>(null);

	const poolStore = useStakingPoolStore();
	const amIOwner = poolStore((state) => state.amIOwner);
	const getPlansInfo = poolStore((state) => state.getPlansInfo);
	const loading = poolStore((state) => state.getPlans) as any;
	const [canView, setCanView] = useState<boolean>(false);

	const navigateTo = useNavigate();

	async function checkIsOwner() {
		if (isConnected == false) {
			navigateTo('/');
			return false;
		}
		const isOwner = await amIOwner();
		if (isOwner == false) {
			navigateTo('/');
			return false;
		}
		setCanView(true);
	}

	useEffect(() => {
		checkIsOwner();
	}, [isConnected]);

	// A function to fetch plans (this used to live in AdminPlansTable)
	const fetchPlans = async () => {
		try {
			const data = await getPlansInfo();
			setPlansData(data);
		} catch (error) {
			console.error('Error fetching plans:', error);
		}
	};

	useEffect(() => {
		fetchPlans();
	}, []);

	if (!canView) {
		return null;
	}

	return (
		<main className="w-full flex flex-col gap-4">
			<h1 className="outline-text">Plans</h1>

			<AdminPlansTable
				plansData={plansData}
				refreshData={fetchPlans}
				loading={loading.getPlansInfo}
			/>

			<Button
				disabled={loading.getPlansInfo}
				onClick={() => setNewPlanDialog(true)}
				variant="contained"
				className="max-[850px]:!mb-12 !mx-auto"
				size="large"
			>
				Add Plan
			</Button>
			<NewPlanDialog
				open={newPlanDialog}
				refreshData={fetchPlans}
				onClose={() => setNewPlanDialog(false)}
			/>

			<AdminStatisticsText />

			<AdminStatisticsPlans
				loading={loading.getPlansInfo}
				plansData={plansData}
			/>

			<ChangeOwner />
		</main>
	);
}
