import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LButton from '../components/ui/Button/Button';

let resolveCallback: (value: boolean) => void;

const ConfirmationDialog = ({
	loading,
	open,
	message,
	autoClose,
	onClose,
}: {
	loading?: boolean;
	open: boolean;
	message: string;
	autoClose: boolean;
	onClose: (result: boolean) => void;
}) => {
	const handleNoClick = () => {
		resolveCallback(false);
		onClose(false); // Always close on "No"
	};

	const handleYesClick = () => {
		resolveCallback(true);
		if (autoClose) {
			onClose(true); // Close only if autoClose is true
		}
	};

	return (
		<Dialog
			open={open}
			onClose={() => (loading == false ? onClose(false) : null)}
		>
			<DialogTitle>Confirm</DialogTitle>
			<DialogContent dividers>
				<DialogContentText className="!text-white">
					{message}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<LButton
					disabled={loading}
					variant="text"
					onClick={handleNoClick}
				>
					No
				</LButton>
				<LButton
					loading={loading}
					variant="contained"
					onClick={handleYesClick}
					autoFocus
				>
					Yes
				</LButton>
			</DialogActions>
		</Dialog>
	);
};

const useConfirmationDialog = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const [autoClose, setAutoClose] = useState(true);

	const openDialog = (text: string, options?: { autoClose?: boolean }) => {
		setMessage(text);
		setIsOpen(true);
		setLoading(false); // Reset loading state
		setAutoClose(options?.autoClose ?? true); // Default to auto-close if not specified
		return new Promise<boolean>((resolve) => {
			resolveCallback = resolve;
		});
	};

	const closeDialog = () => {
		setIsOpen(false);
		setLoading(false); // Reset loading state
	};

	const handleClose = () => {
		closeDialog();
	};

	const dialogElement = (
		<ConfirmationDialog
			loading={loading}
			open={isOpen}
			message={message}
			autoClose={autoClose}
			onClose={handleClose}
		/>
	);

	return { openDialog, setLoading, closeDialog, dialogElement };
};

export default useConfirmationDialog;
