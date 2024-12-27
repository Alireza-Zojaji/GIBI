import { useEffect, useState } from 'react';
import CustomeTable from '../../components/ui/Table/CustomTable';
import {
	formatTimestamp,
	transformIntoNormalNumber,
} from '../../utility/functions';
import { HiCheck, HiX } from 'react-icons/hi';

interface GainPlansTableProps {
	plansData: any;
	investmentsData: any;
	totalInfo: any;
	loading?: boolean;
}

function findThirdItem(array: Array<any>, number: number) {
	for (const obj of array) {
		if (obj[0] === BigInt(number)) {
			return obj[3];
		}
	}
	return null; // Return null if no match is found
}

export default function GainTable({
	investmentsData,
	plansData,
	loading,
	totalInfo,
}: GainPlansTableProps) {
	const [rows, setRows] = useState<Array<any>>([]);

	useEffect(() => {
		if (!investmentsData) return;

		console.log('totalInfo::::', totalInfo);

		const newRows = [
			...investmentsData,
			{
				0: 'Total',
				1: 99999,
				2: totalInfo[2],
				4: totalInfo[0],
				5: totalInfo[1],
			},
		]
			.sort((a: any, b: any) => {
				return Number(b[1]) - Number(a[1]);
			})
			.map((plan: any, index: number) => [
				plan[0] == 'Total'
					? plan[0]
					: `Plan ${findThirdItem(plansData, plan[0])}`,
				transformIntoNormalNumber(Number(plan[4])),
				<p className="leading-loose break-all">
					{transformIntoNormalNumber(Number(plan[5]), true)}
				</p>,
				plan[1] === 99999 ? 'Now' : formatTimestamp(Number(plan[1])),
				typeof plan[2] == 'boolean' ? (
					<div
						className="text-2xl 850px:w-full 850px:flex 850px:items-center 850px:justify-center"
						key={`status-${index}`}
					>
						{plan[2] ? <HiCheck /> : <HiX />}
					</div>
				) : (
					plan[2]
				),
			]);

		setRows(newRows);
	}, [investmentsData]);

	return (
		<div className="w-full 850px:px-8">
			<CustomeTable
				pageSize={5}
				loading={loading}
				headers={['', 'Invest', 'Gain', 'Date', 'Withdrawal']}
				rows={rows}
			/>
		</div>
	);
}
