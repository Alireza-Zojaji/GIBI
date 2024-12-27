import { usePageStore } from '../../../store/usePageStore';
import { useAppKitAccount } from '@reown/appkit/react';
import { useEffect, useState } from 'react';
import NavItem from './NavItem';
import { useMediaQuery, IconButton, Menu, MenuItem } from '@mui/material';
import { HiMenu } from 'react-icons/hi';
import { useStakingPoolStore } from '../../../providers/staking-pool-provider';

export default function NavBar() {
	const { pages } = usePageStore();
	const [isOwner, setIsOwner] = useState<boolean>(false);
	const { isConnected } = useAppKitAccount();
	const poolStore = useStakingPoolStore();
	const amIOwner = poolStore((state) => state.amIOwner);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const isMobile = useMediaQuery('(max-width:600px)');

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	async function checkIsOwner() {
		if (!isConnected) {
			setIsOwner(false);
			return false;
		}
		const isOwner = await amIOwner();
		setIsOwner(isConnected && isOwner);
	}

	useEffect(() => {
		checkIsOwner();
	}, [isConnected]);

	return (
		<nav className="flex z-[100] fixed top-0 h-[6.5dvh] w-full py-3 px-4 gap-2 lg:gap-4 bg-primary-500 shadow-lg shadow-primary-100">
			{!isMobile &&
				pages &&
				pages.length > 0 &&
				pages.map((page, index) => {
					if (page.admin && !isOwner) return null;
					if (page.login && !isConnected) return null;
					return <NavItem page={page} key={index} />;
				})}

			{isMobile && (
				<>
					<IconButton
						className="!ms-1"
						edge="start"
						color="inherit"
						aria-label="menu"
						onClick={handleMenuOpen}
					>
						<HiMenu />
					</IconButton>
					<Menu
						className="ms-3"
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleMenuClose}
					>
						{pages &&
							pages.length > 0 &&
							pages.map((page, index) => {
								if (page.admin && !isOwner) return null;
								if (page.login && !isConnected) return null;
								return (
									<MenuItem
										onClick={handleMenuClose}
										key={index}
									>
										<NavItem
											className={isMobile ? 'w-full' : ''}
											page={page}
										/>
									</MenuItem>
								);
							})}
					</Menu>
				</>
			)}

			<div className="items-center ms-auto hidden lg:flex">
				<appkit-button size="md" balance="show" />
			</div>
			<div className="ms-auto lg:hidden flex items-center">
				<appkit-button size="sm" balance="hide" />
			</div>
		</nav>
	);
}
