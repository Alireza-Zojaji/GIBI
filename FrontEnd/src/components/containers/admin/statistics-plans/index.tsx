import { CircularProgress } from '@mui/material';
import {
	isLargeNumber,
	transformIntoNormalNumber,
} from '../../../../utility/functions';

interface AdminStatisticsPlansProps {
	plansData: any;
	loading: boolean;
}

export default function AdminStatisticsPlans({
	plansData,
	loading,
}: AdminStatisticsPlansProps) {
	// Ensure plansData is only processed if available and loading is false
	const processedPlansData = plansData && !loading ? Object.values(plansData).slice(1) : [];

	const StaticItem = ({ data, index }: { data: any; index: number }) => {
		return (
			<section className="flex flex-col bg-primary-300 gap-4 p-4 pb-8 border rounded-xl min-w-[320px]">
				<h2 className="text-center mb-4">Plan {index}</h2>

				{(!loading && (
					<>
						<div className="w-full flex text-lg justify-between">
							<p className="text-secondary-400 font-semibold">
								Investment Sum:
							</p>
							<p className="text-xl">
								{String(data['7'] || 0).slice(0, 6)}
							</p>
						</div>
						<div className="w-full flex text-lg justify-between">
							<p className="text-secondary-400 font-semibold">
								Gain Sum:
							</p>
							<p className="text-xl">
								{String(data['8'] || 0).slice(0, 6)}
							</p>
						</div>
						<div className="w-full flex text-lg justify-between">
							<p className="text-secondary-400 font-semibold">
								Withdrawal Sum:
							</p>
							<p className="text-xl">
								{String(data['9'] || 0).slice(0, 6)}
							</p>
						</div>
					</>
				)) || (
					<div className="w-full flex items-center justify-center h-[15dvh]">
						<CircularProgress />
					</div>
				)}
			</section>
		);
	};

	if (loading) {
		// Render placeholder plans with 0 data
		return (
			<section className="w-full gap-8 flex flex-wrap mt-8 850px:px-8 justify-around">
				{Array.from({ length: 3 }).map((_, index) => (
					<StaticItem
						data={{ 6: 0, 7: 0, 8: 0 }}
						index={index + 1}
						key={index}
					/>
				))}
			</section>
		);
	}

	return (
		<section className="w-full gap-8 flex flex-wrap mt-8 850px:px-8 justify-around">
			{processedPlansData.map((item: any, index: number) => {
				const transformedData = Object.entries(item).map(
					([_, value]: [any, any], index) =>
						isLargeNumber(value) && index >= 5
							? transformIntoNormalNumber(value)
							: value
				);

				return (
					<StaticItem
						data={transformedData}
						index={index + 1}
						key={index}
					/>
				);
			})}
		</section>
	);
}
