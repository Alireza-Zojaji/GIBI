import { useEffect, useState } from 'react';
import InvestCard from './InvestCard';
import { useStakingPoolStore } from '../../providers/staking-pool-provider';

export default function InvestPageView() {
	const poolStore = useStakingPoolStore();
	const getPlans = poolStore((state) => state.getPlans);
	const loading = poolStore((state) => state.loading);
	const [plans, setPlans] = useState<Array<any>>([]);

	async function fetchData() {
		const res = (await getPlans()) as any;
		console.log('Res:', res);
		const sortedRes = res.sort((a: any, b: any) => {
			return Number(a[3]) - Number(b[3]);
		});
		setPlans(sortedRes);
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<section className="w-full flex flex-col gap-6">
			<h1 className="outline-text">Invest</h1>
			<div className="w-full flex flex-wrap gap-6 justify-around">
				{(!loading.getPlans &&
					plans.map((item) => (
						<InvestCard data={item} loading={loading.getPlans} />
					))) ||
					[0, 1, 2].map((index) => (
						<InvestCard data={{ 3: index + 1 }} loading={true} />
					))}
			</div>
		</section>
	);
}
