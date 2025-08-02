import * as SearchTemplates from "@stores/searchTemplates";
import { SEARCH } from "@utils/urlParams";
import useDeffered from "@utils/useDeffered";
import { useEffect, useRef, useState } from "react";

interface Props {
	/** Search param value */
	search?: string;
	/** Function triggered on debounced input change */
	onSearchChange?: (search: string) => void;
}

export default ({ search = "", onSearchChange }: Props) => {
	const [searchValue, setSearchValue] = useState<string>(search);
	const formRef = useRef<HTMLFormElement>(null);
	const defferedSearchValue = useDeffered(searchValue);

	useEffect(() => {
		if (onSearchChange) {
			onSearchChange(defferedSearchValue);
		} else {
			formRef.current && handleSubmit(new FormData(formRef.current));
		}
	}, [defferedSearchValue]);

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
