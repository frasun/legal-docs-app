import type { DocumentCategory } from "@type";
import { CATEGORY } from "@utils/urlParams";
import { navigate } from "astro:transitions/client";
import { useRef, type ChangeEvent } from "react";

interface Props {
	/** A collection of category data */
	categories: DocumentCategory[];
	/** Selected category slug / id */
	selectedCategory?: DocumentCategory["slug"];
	/** Trigger callback on selected category change */
	onCategoryChange?: (categoryId: DocumentCategory["slug"]) => void;
}

export default ({
	categories = [],
	selectedCategory = "",
	onCategoryChange,
}: Props) => {
	const formRef = useRef<HTMLFormElement>(null);

	const changeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
		const { value } = event.target;

		if (onCategoryChange) {
			onCategoryChange(value);
		} else {
			formRef.current && handleSubmit(new FormData(formRef.current));
		}
	};

	const handleSubmit = (formData: FormData) => {
		const category = formData.get(CATEGORY);
		const url = new URL(document.location.href);

		if (category === null) return;

		const cat = category.toString();

		if (cat.length) {
			url.searchParams.set(CATEGORY, cat);
		} else {
			url.searchParams.delete(CATEGORY);
		}

		navigate(url.href);
	};

	return (
		<form action={handleSubmit} ref={formRef}>
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
		</form>
	);
};
