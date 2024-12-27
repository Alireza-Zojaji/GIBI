import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

type LButtonProps = ButtonProps & {
	loading?: boolean;
	loadingText?: string;
};

const LButton: React.FC<LButtonProps> = ({
	loading,
	loadingText,
	children,
	disabled,
	...props
}) => {
	return (
		<Box
			className={(props.className && props.className) || ''}
			sx={{
				position: 'relative',
				display: 'inline-block',
				width: 'fit-content',
			}}
		>
			<Button
				{...props}
				disabled={loading || disabled}
				sx={{
					...props.sx,
					...(loading && {
						cursor: 'not-allowed',
					}),
				}}
			>
				{loading ? loadingText || 'Loading...' : children}
			</Button>
			{loading && (
				<CircularProgress
					size={24}
					sx={{
						color: 'inherit',
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%) !important',
					}}
				/>
			)}
		</Box>
	);
};

export default LButton;
