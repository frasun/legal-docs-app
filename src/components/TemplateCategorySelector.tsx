import type { DocumentCategory } from "@type";

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
	const changeCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
		if (onCategoryChange) {
			onCategoryChange(event.target.value);
		}
	};

	return (
		<select
			name="templateCategory"
			onChange={changeCategory}
			value={selectedCategory}
		>
			<option value="">Wszystkie kategorie</option>
			{categories.map(({ slug: id, title: name }) => (
				<option value={id} key={`option-${id}`}>
					{name}
				</option>
			))}
		</select>
	);
};
