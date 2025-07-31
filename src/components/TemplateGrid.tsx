import type { DocumentCategory, TemplateShort } from "@type";
import DocumentTile from "@components/TemplateTile";

interface Props {
	/** Available document templates */
	templates: TemplateShort[];
	/** List of template category names */
	categories: DocumentCategory[];
}

export default ({ templates, categories }: Props) => {
	const getCategoryName = (slug: string) => {
		const ct = categories.find(({ slug: id }) => id === slug);

		return ct ? ct.title : "";
	};

	const getCategoryList = (categories: string[]) =>
		categories
			.sort((a, b) => a.localeCompare(b))
			.map((id) => getCategoryName(id));

	return (
		<section className="col-span-12 grid gap-20 lg:gap-30 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6 pt-10 auto-rows-max">
			{templates.map(({ title, categories, price, draft, slug }) => (
				<DocumentTile
					slug={slug}
					title={title}
					categories={getCategoryList(categories)}
					price={price}
					draft={draft}
					key={slug}
				/>
			))}
		</section>
	);
};
