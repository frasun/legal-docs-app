import trimWhitespace from "@utils/whitespace";
import { useEffect, useState, type ChangeEvent } from "react";

interface Props {
	/** Search param value */
	search?: string;
	/** Function triggered on debounced input change */
	onSearchChange?: (search: string) => void;
}

const DEBOUNCE = 500;

export default ({ search = "", onSearchChange }: Props) => {
	const [searchValue, setSearchValue] = useState(search);

	useEffect(() => {
		if (!onSearchChange) return;

		const emitChange = setTimeout(() => {
			onSearchChange(searchValue);
		}, DEBOUNCE);

		return () => clearTimeout(emitChange);
	}, [searchValue]);

	return (
		<>
			<input
				type="search"
				placeholder="Wyszukaj dokument lub sprawę np. umowa najmu, testament"
				spellCheck="false"
				value={searchValue}
				onChange={(event: ChangeEvent<HTMLInputElement>) =>
					setSearchValue(event.target.value)
				}
			/>
		</>
	);
};
