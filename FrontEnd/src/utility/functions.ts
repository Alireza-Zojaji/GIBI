import BigNumber from 'bignumber.js';

export function transformIntoNormalNumber(
	num: number | BigInt | string,
	toFixed?: boolean
): string {
	// Convert input to BigNumber
	const value = new BigNumber(num.toString());

	// Perform the transformation
	const transformedValue = value.multipliedBy(new BigNumber(10).pow(-18));

	// Apply toFixed(18) if the option is set, otherwise return the plain value
	return toFixed ? transformedValue.toFixed(18) : transformedValue.toString();
}

export const isLargeNumber = (value: number) => value > 1_000_000;

export function formatTimestamp(timestamp: number) {
	// Convert seconds to milliseconds
	const date = new Date(timestamp * 1000);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}/${month}/${day}, ${hours}:${minutes}:${seconds}`;
}
