import type { TemplateShort } from "@type";
import DocumentTile from "@components/TemplateTile";
import EmptyScreen from "@components/EmptyScreen/EmptyScreen";

interface Props {
	/** Available document templates */
	templates: TemplateShort[];
}

export default function ({ templates }: Props) {
	return (
		<>
			{templates.length ? (
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
			) : (
				<EmptyScreen>Brak dokumentów do wyświetlenia</EmptyScreen>
			)}
		</>
	);
}
