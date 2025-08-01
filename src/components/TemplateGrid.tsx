import type { DocumentCategory, TemplateShort } from "@type";
import DocumentTile from "@components/TemplateTile";
import { use } from "react";

interface Props {
	/** Available document templates */
	templatesPromise: Promise<TemplateShort[]>;
}

export default ({ templatesPromise }: Props) => {
	const templates = use(templatesPromise);

	return (
		<section className="col-span-12 grid gap-20 lg:gap-30 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6 pt-10 auto-rows-max">
			{templates.map(({ title, categories, price, draft, slug }) => (
				<DocumentTile
					slug={slug}
					title={title}
					categories={categories}
					price={price}
					draft={draft}
					key={slug}
				/>
			))}
		</section>
	);
};
