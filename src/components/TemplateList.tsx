import { Suspense, useEffect, useState } from "react";
import TemplateGrid from "@components/TemplateGrid";
import type { DocumentCategory, TemplateShort } from "@type";
import Loading from "@components/Loading";
import { ErrorBoundary } from "react-error-boundary";
import EmptyScreen from "./EmptyScreen/emptyScreen";
import fetchTemplates from "@api/client/templates";

import { StrictMode } from "react";

interface Props {
	/** A collection of category data */
	categories: DocumentCategory[];
	/** Current search query */
	search?: string;
	/** Selected category */
	category?: string;
}

export default ({ categories: categoryList, search, category }: Props) => {
	const [templates, setTemplates] = useState<Promise<TemplateShort[]>>();

	useEffect(() => {
		setTemplates(fetchTemplates({ category, search, categoryList }));
	}, []);

	return templates ? (
		<ErrorBoundary
			fallback={<EmptyScreen>Brak elementów do wyświetlenia</EmptyScreen>}
		>
			<Suspense fallback={<Loading />}>
				<TemplateGrid templatesPromise={templates} />
			</Suspense>
		</ErrorBoundary>
	) : (
		<></>
	);
};
