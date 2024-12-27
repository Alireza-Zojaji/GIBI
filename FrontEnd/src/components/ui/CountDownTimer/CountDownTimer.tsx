import { CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
	loading?: boolean;
	initialSeconds: number;
	timerFinished?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
	loading = false,
	initialSeconds,
	timerFinished,
}) => {
	const [timeLeft, setTimeLeft] = useState(initialSeconds);

	useEffect(() => {
		console.log(initialSeconds);
		setTimeLeft(initialSeconds);
	}, [initialSeconds]);

	useEffect(() => {
		if (timeLeft <= 0) {
			if (timerFinished) {
				timerFinished();
			}
			return;
		}
		const timerId = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timerId);
	}, [timeLeft]);

	const formatTime = (seconds: number) => {
		const days = Math.floor(seconds / (24 * 60 * 60));
		const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
		const minutes = Math.floor((seconds % (60 * 60)) / 60);
		const secs = seconds % 60;

		return { days, hours, minutes, secs };
	};

	const { days, hours, minutes, secs } = formatTime(timeLeft);

	return (
		<div className="flex items-center justify-center gap-4 font-sans text-secondary-400">
			{[
				{ label: 'Day', value: days },
				{ label: 'Hour', value: hours },
				{ label: 'Min', value: minutes },
				{ label: 'Sec', value: secs },
			].map((unit, index) => (
				<div key={index} className="text-center">
					<div className="text-sm font-medium mb-1">{unit.label}</div>
					<div className="w-16 h-16 flex items-center text-primary-400 justify-center border-2 border-black rounded-md text-2xl font-bold bg-gray-200">
						{loading ? (
							<CircularProgress color="inherit" size={24} />
						) : (
							unit.value
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default CountdownTimer;
