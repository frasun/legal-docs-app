import { useEffect, useState } from "react";

const DEBOUNCE = 250;

/**
 * Deffer updating the value by the time of delay
 *
 * @param value Updated value.
 * @param delay Time to update in ms.
 */
export default <T>(value: T, delay = DEBOUNCE) => {
	const [defferedValue, setDefferedValue] = useState(value);

	useEffect(() => {
		const emitChangeTimeout = setTimeout(() => {
			setDefferedValue(value);
		}, delay);

		return () => clearTimeout(emitChangeTimeout);
	}, [value]);

	return defferedValue;
};
