import { CATEGORY, SEARCH } from "@utils/urlParams";
import { useEffect, useRef, useState } from "react";

interface Props {
	/** Search param value */
	search?: string;
	/** Function triggered on debounced input change */
	onSearchChange?: (search: string) => void;
}

const DEBOUNCE = 500;

export default ({ search = "", onSearchChange }: Props) => {
	const [searchValue, setSearchValue] = useState<string>(search);
	const [categoryParam, setCategoryParam] = useState<string>();
	const init = useRef(false);
	const submitRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const url = new URL(document.location.href);
		const category = url.searchParams.get(CATEGORY);

		if (category) {
			setCategoryParam(category);
		}
	}, []);

	useEffect(() => {
		if (!init.current) {
			init.current = true;
			return;
		}

		const emitChange = setTimeout(() => {
			if (onSearchChange) {
				onSearchChange(searchValue);
			} else {
				submitRef.current?.click();
			}
		}, DEBOUNCE);

		return () => clearTimeout(emitChange);
	}, [searchValue]);

	return (
		<form
			method="GET"
			spellCheck="false"
			className="flex gap-10 flex-grow items-center"
			onSubmit={(e) => onSearchChange && e.preventDefault()}
		>
			<input
				type="search"
				name={SEARCH}
				placeholder="Wyszukaj dokument lub sprawę np. umowa najmu, testament"
				spellCheck="false"
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				className="flex-grow w-0"
			/>
			{categoryParam && (
				<input type="hidden" name={CATEGORY} value={categoryParam} />
			)}
			<input type="submit" ref={submitRef} style={{ display: "none" }} />
		</form>
	);
};
