import type { DocumentCategory } from "@type";
import { CATEGORY, SEARCH } from "@utils/urlParams";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

interface Props {
	categories: DocumentCategory[];
	selectedCategory?: DocumentCategory["slug"];
	onCategoryChange?: (categoryId: DocumentCategory["slug"]) => void;
}

export default ({
	categories = [],
	selectedCategory,
	onCategoryChange,
}: Props) => {
	const [searchValue, setSearchValue] = useState<string>();
	const submitRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const url = new URL(document.location.href);
		const searchParam = url.searchParams.get(SEARCH);

		if (searchParam) {
			setSearchValue(searchParam);
		}
	}, []);

	const changeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
		const { value } = event.target;

		if (onCategoryChange) {
			onCategoryChange(value);
		} else {
			submitRef.current?.click();
		}
	};

	return (
		<form method="GET" onSubmit={(e) => onCategoryChange && e.preventDefault()}>
			<select
				name={CATEGORY}
				onChange={changeCategory}
				defaultValue={selectedCategory}
			>
				<option value="">Wszystkie kategorie</option>
				{categories.map(({ slug: id, title: name }) => (
					<option value={id} key={`option-${id}`}>
						{name}
					</option>
				))}
			</select>
			{searchValue && <input type="hidden" name={SEARCH} value={searchValue} />}
			<input type="submit" ref={submitRef} style={{ display: "none" }} />
		</form>
	);
};
