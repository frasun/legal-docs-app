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
	const [searchValue, setSearchValue] = useState(trimWhitespace(search));

	useEffect(() => {
		if (!onSearchChange) return;

		const emitChange = setTimeout(() => {
			onSearchChange(searchValue);
		}, DEBOUNCE);

		return () => clearTimeout(emitChange);
	}, [searchValue]);

	return (
		<form
			method="GET"
			spellCheck="false"
			className="flex gap-10 flex-grow items-center"
			onSubmit={(e) => e.preventDefault()}
		>
			<input
				type="search"
				name="s"
				placeholder="Wyszukaj dokument lub sprawę np. umowa najmu, testament"
				spellCheck="false"
				value={searchValue}
				onChange={(event: ChangeEvent<HTMLInputElement>) =>
					setSearchValue(event.target.value)
				}
				className="flex-grow w-0"
			/>
		</form>
	);
};
