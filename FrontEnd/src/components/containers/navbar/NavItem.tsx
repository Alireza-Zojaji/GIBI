import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from '../../../store/usePageStore';
import { Button } from '@mui/material';

export default function NavItem({
	page,
	className = '',
}: {
	page: Page;
	className?: string;
}) {
	const location = useLocation();
	const navigate = useNavigate();

	const isSelected = page.route === location.pathname;

	const handleClick = () => {
		navigate(page.route);
	};

	return (
		<Button
			className={className}
			onClick={handleClick}
			variant={isSelected ? 'contained' : 'outlined'}
			startIcon={
				<page.Icon
					className={`${
						isSelected ? 'text-primary-500' : 'text-secondary-500'
					} lg:text-xl text-sm`}
				/>
			}
		>
			{page.title}
		</Button>
	);
}
