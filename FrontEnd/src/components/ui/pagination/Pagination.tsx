// Pagination.jsx
import { useState } from 'react';

export default function Pagination({
	totalCount,
	eachPageCount,
	setNowOffset,
	disabled = false,
	className = '',
}: {
	totalCount: number;
	eachPageCount: number;
	setNowOffset: (num: number) => void;
	disabled?: boolean;
	className?: string;
}) {
	const totalPages = Math.ceil(totalCount / eachPageCount);
	const [currentPage, setCurrentPage] = useState(1);

	// Function to handle page change
	const handlePageChange = (page: number) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
			setNowOffset((page - 1) * eachPageCount);
		}
	};

	// Function to generate pagination numbers
	const getPagination = () => {
		const pages = [];
		pages.push(1);

		if (currentPage > 3) {
			pages.push('...');
		}

		for (
			let i = Math.max(2, currentPage - 1);
			i <= Math.min(currentPage + 1, totalPages - 1);
			i++
		) {
			pages.push(i);
		}

		if (currentPage < totalPages - 2) {
			pages.push('...');
		}

		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	};

	const buttonStyles =
		'py-2 px-2.5 border rounded-lg bg-primary-100 opacity-50 enabled:opacity-100 enabled:cursor-pointer cursor-not-allowed';

	return (
		<section
			className={`w-full flex items-center justify-center gap-3 ${className}`}
		>
			{/* Previous arrow */}
			<button
				className={`${buttonStyles} ${
					currentPage === 1 ? 'disabled' : ''
				}`}
				disabled={disabled || currentPage === 1}
				onClick={() => handlePageChange(currentPage - 1)}
			>
				&#60;
			</button>

			{/* Pagination numbers */}
			{getPagination().map((page: any, index) =>
				page === '...' ? (
					<button key={index} className={`${buttonStyles}`}>
						{page}
					</button>
				) : (
					<button
						key={index}
						className={`${buttonStyles} ${
							page === currentPage ? 'active' : ''
						}`}
						disabled={disabled}
						onClick={() => handlePageChange(page)}
					>
						{page}
					</button>
				)
			)}

			{/* Next arrow */}
			<button
				className={`${buttonStyles} ${
					currentPage === totalPages ? 'disabled' : ''
				}`}
				disabled={disabled || currentPage === totalPages}
				onClick={() => handlePageChange(currentPage + 1)}
			>
				&#62;
			</button>
		</section>
	);
}
