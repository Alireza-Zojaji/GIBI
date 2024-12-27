import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useState } from 'react';
import { CircularProgress } from '@mui/material';
import Pagination from '../pagination/Pagination';

type CustomTableProps = {
	loading?: boolean;
	headers: string[];
	rows: (React.ReactNode | number | string)[][];
	pageSize?: number;
};

const StyledTableContainer = styled(TableContainer)(() => ({
	border: '1px solid #ccc',
	borderRadius: '12px',
	// Remove/override overflow if you want card corners visible:
	// overflow: 'hidden',
	// or:
	// overflow: 'visible',
	tableLayout: 'fixed',

	// Up to 850px
	'@media screen and (max-width: 850px)': {
		border: 'none',
		boxShadow: 'none',

		'& table': {
			border: 'none',
		},

		'& thead': {
			border: 'none',
			clip: 'rect(0 0 0 0)',
			height: '1px',
			margin: '-1px',
			overflow: 'hidden',
			padding: 0,
			position: 'absolute',
			width: '1px',
		},

		// Each row as a card
		'& tr': {
			display: 'block',
			marginBottom: '2rem',
			border: '1px solid #ddd',
			borderRadius: '8px',
			padding: '1rem',
			backgroundColor: '#0e151b',
		},

		// Make td a flex container that centers its content
		'& td': {
			display: 'flex',
			justifyContent: 'center',
			paddingLeft: '13rem !important',
			alignItems: 'center',
			position: 'relative',
			padding: '0.625em',
			borderBottom: '1px solid #ddd',
			fontSize: '.8em',
			textAlign: 'center', // the value is centered
		},

		'& td:first-child': {
			paddingInline: '0 !important',
		},

		'& td:last-child': {
			borderBottom: 'none',
			paddingInline: '0 !important',
		},

		'& tr:last-child': {
			marginBottom: '0 !important',
		},

		// Absolutely position the label on the left
		'& td::before': {
			content: 'attr(data-label)',
			position: 'absolute',
			left: '1rem',
			top: '50%',
			transform: 'translateY(-50%)',
			fontWeight: 'bold',
			textTransform: 'uppercase',
		},
	},
}));

const StyledTable = styled(Table)(() => ({
	width: '100%',
	borderCollapse: 'collapse',
	margin: 0,
	padding: 0,
}));

const StyledTableRow = styled(TableRow)(() => ({
	// Desktop
	'&:nth-of-type(odd)': {
		backgroundColor: '#12171c',
	},
	'&:nth-of-type(even)': {
		backgroundColor: '#151b21',
	},

	// Unify background color on small screens if desired
	'@media (max-width: 850px)': {
		'&:nth-of-type(odd), &:nth-of-type(even)': {
			backgroundColor: '#12171c',
		},
	},
}));

const StyledTableCell = styled(TableCell)(() => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: '#0e151b',
		color: '#fdeca6',
		fontWeight: 'bold',
		textAlign: 'center',
		'@media screen and (max-width: 850px)': {
			fontSize: '30px',
		},
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
		color: '#fbd464',
		textAlign: 'center',
	},
}));

export default function CustomeTable({
	headers,
	rows,
	loading,
	pageSize = 10,
}: CustomTableProps) {
	const [nowOffset, setNowOffset] = useState(0);

	const currentPageRows = rows.slice(nowOffset, nowOffset + pageSize);
	return (
		<div style={{ width: '100%' }}>
			<StyledTableContainer
				sx={{
					backgroundColor: '#0e151b',
					overflow: 'hidden',
					boxShadow: '0px 0px 12px #fce086',
					borderRadius: '12px',
					'@media (max-width: 850px)': {
						overflow: 'visible',
					},
				}}
			>
				<StyledTable aria-label="customized table">
					<TableHead>
						<TableRow>
							{headers.map((header, index) => (
								<StyledTableCell key={index}>
									{header}
								</StyledTableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{!loading &&
							currentPageRows.map((row, rowIndex) => (
								<StyledTableRow key={rowIndex}>
									{row.map((cell, cellIndex) => (
										<StyledTableCell
											key={cellIndex}
											data-label={headers[cellIndex]}
										>
											{cell}
										</StyledTableCell>
									))}
								</StyledTableRow>
							))}

						{loading && (
							<TableRow>
								<TableCell
									colSpan={headers.length}
									align="center"
								>
									<div className="flex items-center justify-center w-full min-h-[15dvh]">
										<CircularProgress />
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</StyledTable>
			</StyledTableContainer>

			{/* Pagination */}
			{!loading && (
				<Pagination
					className="mt-4"
					totalCount={rows.length}
					eachPageCount={pageSize}
					setNowOffset={setNowOffset}
				/>
			)}
		</div>
	);
}
