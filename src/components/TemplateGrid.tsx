import type { TemplateShort } from "@type";
import DocumentTile from "@components/TemplateTile";
import { use, type HTMLAttributes } from "react";
import EmptyScreen from "./EmptyScreen/emptyScreen";

interface Props extends HTMLAttributes<HTMLElement> {
	/** Available document templates */
	templatesPromise: Promise<TemplateShort[]>;
}

export default ({ templatesPromise, style }: Props) => {
	const templates = use(templatesPromise);

	return (
		<>
			{templates.length ? (
				<section
					className="col-span-12 grid gap-20 lg:gap-30 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6 pt-10 auto-rows-max"
					style={style}
				>
					{templates.map(({ title, categories, price, draft, slug }) => (
						<DocumentTile
							slug={`${document.location.origin}/dokumenty/${slug}`}
							title={title}
							categories={categories}
							price={price}
							draft={draft}
							key={slug}
						/>
					))}
				</section>
			) : (
				<EmptyScreen>Brok dokumentów do wyświetlenia</EmptyScreen>
			)}
		</>
	);
};
