import * as SearchTemplates from "@stores/searchTemplates";
import { SEARCH } from "@utils/urlParams";
import { useEffect, useRef, useState } from "react";

interface Props {
	/** Search param value */
	search?: string;
	/** Function triggered on debounced input change */
	onSearchChange?: (search: string) => void;
}

const DEBOUNCE = 250;

export default ({ search = "", onSearchChange }: Props) => {
	const [searchValue, setSearchValue] = useState<string>(search);
	const init = useRef(false);
	const formRef = useRef<HTMLFormElement>(null);

	/**
	 * Debounce propagation of changes to onSearchChange or as form submission
	 */
	useEffect(() => {
		if (!init.current) {
			init.current = true;
			return;
		}

		const emitChange = setTimeout(() => {
			if (onSearchChange) {
				onSearchChange(searchValue);
			} else {
				formRef.current && handleSubmit(new FormData(formRef.current));
			}
		}, DEBOUNCE);

		return () => clearTimeout(emitChange);
	}, [searchValue]);

	/**
	 * Handle form submission - navigate to url with params
	 *
	 * @param formData Submitted form fields.
	 */
	const handleSubmit = (formData: FormData) => {
		const search = formData.get(SEARCH);

		if (search === null) return;

		const query = search.toString();

		if (query.length) {
			SearchTemplates.setQuery(query);
		} else {
			SearchTemplates.resetQuery();
		}
	};

	return (
		<form
			action={handleSubmit}
			spellCheck="false"
			className="flex gap-10 flex-grow items-center max-w-[300px]"
			ref={formRef}
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
		</form>
	);
};
