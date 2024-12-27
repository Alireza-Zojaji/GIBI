import { useEffect, useState } from 'react';
import {
	isLargeNumber,
	transformIntoNormalNumber,
} from '../../../../utility/functions';
import { CircularProgress } from '@mui/material';
import { useStakingPoolStore } from '../../../../providers/staking-pool-provider';

export default function AdminStatisticsText() {
	const poolStore = useStakingPoolStore();
	const getSystemInfo = poolStore((state) => state.getSystemInfo);
	const loading = poolStore((state) => state.loading);
	const [systemData, setSystemData] = useState<Array<string>>([]);

	async function fetchData() {
		const res = (await getSystemInfo()) as Array<string>;

		setSystemData(
			res.map((item: any) =>
				isLargeNumber(Number(item))
					? transformIntoNormalNumber(item)
					: item
			)
		);
	}

	useEffect(() => {
		fetchData();
	}, []);

	const StaticItem = ({ title, value }: { title: string; value: string }) => (
		<div className="flex items-center bg-primary-200 font-semibold border flex-1 min-w-[200px] text-lg p-4 rounded-lg gap-4">
			<p className="text-secondary-400">{title}:</p>
			{loading.getSystemInfo ? (
				<CircularProgress size={24} />
			) : (
				<p>{value}</p>
			)}
		</div>
	);

	return (
		<section className="flex flex-col gap-6">
			<h1 className="outline-text">Statistics: </h1>
			<div className="flex justify-around flex-wrap gap-6 850px:px-8">
				<StaticItem title="Investor Count" value={systemData[0]} />
				<StaticItem title="Investment Count" value={systemData[1]} />
				<StaticItem
					title="Investment Sum"
					value={`${String(systemData[2]).slice(0, 6)} GIBI`}
				/>
				<StaticItem
					title="Gain Sum"
					value={`${String(systemData[3]).slice(0, 6)} GIBI`}
				/>
				<StaticItem
					title="Withdrawal Sum"
					value={`${String(systemData[4]).slice(0, 6)} GIBI`}
				/>
				<StaticItem
					title="Available Tokens"
					value={`${String(systemData[6]).slice(0, 6)} GIBI`}
				/>
			</div>
		</section>
	);
}
