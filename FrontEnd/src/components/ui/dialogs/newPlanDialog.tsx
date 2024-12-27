// NewPlanDialog.tsx
import React, { useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import LButton from '../Button/Button';
import BigNumber from 'bignumber.js';
import { useStakingPoolStore } from '../../../providers/staking-pool-provider';

interface NewPlanDialogProps {
	open: boolean;
	onClose: () => void;
	refreshData: () => void;
}

interface PlanData {
	duration: string;
	apy: string;
	order: string;
	actives: boolean;
	mainInvestment: string;
}

// Validation schema
const validationSchema = Yup.object().shape({
	duration: Yup.number()
		.typeError('Duration must be a number')
		.positive('Duration must be > 0')
		.required('Duration is required'),
	apy: Yup.number()
		.typeError('APY must be a number')
		.positive('APY must be > 0')
		.required('APY is required'),
	order: Yup.number()
		.typeError('Order must be a number')
		.min(0, 'Order cannot be negative')
		.required('Order is required'),
	actives: Yup.boolean().required('Actives is required'),
	mainInvestment: Yup.number()
		.typeError('Min Investment must be a number')
		.positive('Min Investment must be > 0')
		.required('Min Investment is required'),
});

const NewPlanDialog: React.FC<NewPlanDialogProps> = ({
	open,
	onClose,
	refreshData,
}) => {
	const poolStore = useStakingPoolStore();
	const addPlan = poolStore((state) => state.addPlan);
	const [pending, setPending] = useState<boolean>(false);

	async function addNewPlan(formData: any) {
		setPending(true);

		const mainInvestmentBigInt = new BigNumber(formData.mainInvestment)
			.multipliedBy(new BigNumber(10).pow(18))
			.toFixed(0);

		const res = await addPlan(
			formData.duration * 86400,
			formData.apy,
			formData.order,
			mainInvestmentBigInt,
			formData.actives
		);

		setPending(false);
		if (res == true) {
			toast.success('Plan Added Successfully');
			refreshData();
			handleClose();
		}
	}

	const formik = useFormik<PlanData>({
		initialValues: {
			duration: '',
			apy: '',
			order: '',
			actives: true,
			mainInvestment: '',
		},
		validationSchema,
		onSubmit: (values) => {
			const finalData = {
				duration: Number(values.duration),
				apy: Number(values.apy),
				order: Number(values.order),
				actives: values.actives,
				mainInvestment: Number(values.mainInvestment),
			};
			addNewPlan(finalData);
		},
	});

	const handleClose = () => {
		if (!pending) {
			formik.resetForm(); // Reset the form to its initial state
			onClose(); // Close the dialog
		}
	};

	// Helper to trigger Formik submit + handle toast if errors
	const handleFormikSubmit = async (e: any) => {
		e.preventDefault();
		try {
			await formik.validateForm(); // triggers Yup validation
			formik.handleSubmit(e);
		} catch (error) {
			// If there are validation errors, show the first one in a toast
			if (Object.keys(formik.errors).length > 0) {
				const firstErrorField = Object.keys(formik.errors)[0];
				toast.error((formik.errors as any)[firstErrorField]);
			}
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
			<DialogTitle>New Plan</DialogTitle>

			<form onSubmit={handleFormikSubmit}>
				<DialogContent dividers>
					<TextField
						fullWidth
						disabled={pending}
						margin="normal"
						label="Duration (Days)"
						variant="outlined"
						name="duration"
						value={formik.values.duration}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={Boolean(
							formik.touched.duration && formik.errors.duration
						)}
						helperText={
							formik.touched.duration && formik.errors.duration
						}
					/>

					<TextField
						fullWidth
						disabled={pending}
						margin="normal"
						label="APY (%)"
						variant="outlined"
						name="apy"
						value={formik.values.apy}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={Boolean(formik.touched.apy && formik.errors.apy)}
						helperText={formik.touched.apy && formik.errors.apy}
					/>

					<TextField
						fullWidth
						disabled={pending}
						margin="normal"
						label="Order"
						variant="outlined"
						name="order"
						value={formik.values.order}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={Boolean(
							formik.touched.order && formik.errors.order
						)}
						helperText={formik.touched.order && formik.errors.order}
					/>

					{formik.touched.actives && formik.errors.actives ? (
						<div style={{ color: 'red', fontSize: 12 }}>
							{formik.errors.actives}
						</div>
					) : null}

					<TextField
						fullWidth
						disabled={pending}
						margin="normal"
						label="Min Investment"
						variant="outlined"
						name="mainInvestment"
						value={formik.values.mainInvestment}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						error={Boolean(
							formik.touched.mainInvestment &&
								formik.errors.mainInvestment
						)}
						helperText={
							formik.touched.mainInvestment &&
							formik.errors.mainInvestment
						}
					/>

					{/* Actives Checkbox */}
					<FormControlLabel
						label="Actives"
						control={
							<Checkbox
								disabled={pending}
								name="actives"
								checked={formik.values.actives}
								onChange={(e) =>
									formik.setFieldValue(
										'actives',
										e.target.checked
									)
								}
							/>
						}
					/>
				</DialogContent>

				<DialogActions>
					<LButton
						loading={pending}
						onClick={handleClose}
						variant="text"
					>
						Cancel
					</LButton>
					<LButton
						loading={pending}
						type="submit"
						variant="contained"
						sx={{ color: 'black' }}
					>
						Submit
					</LButton>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default NewPlanDialog;
