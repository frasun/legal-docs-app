import { Suspense, useDeferredValue, useEffect, useState } from "react";
import TemplateGrid from "@components/TemplateGrid";
import type { DocumentCategory, TemplateShort } from "@type";
import Loading from "@components/Loading";
import { withErrorBoundary } from "react-error-boundary";
import fetchTemplates from "@api/client/templates";
import { useStore } from "@nanostores/react";
import { $templateSearch } from "@stores/searchTemplates";
import Error from "@components/Error";
import { displayError } from "@stores/toast";

interface Props {
	/** A collection of category data */
	categories: DocumentCategory[];
	/** Current search query */
	search?: string;
	/** Selected category */
	category?: string;
}

const TemplateList = ({
	categories: categoryList,
	search,
	category,
}: Props) => {
	const [templates, setTemplates] = useState<Promise<TemplateShort[]>>();
	const deferredTemplates = useDeferredValue(templates);
	const searchQuery = useStore($templateSearch);
	const isFetching = deferredTemplates !== templates;

	useEffect(() => {
		const query = "string" === typeof searchQuery ? searchQuery : search;

		setTemplates(fetchTemplates({ category, search: query, categoryList }));
	}, [searchQuery]);

	return deferredTemplates ? (
		<Suspense fallback={<Loading />}>
			<TemplateGrid
				templatesPromise={deferredTemplates}
				style={{ opacity: isFetching ? 0.5 : 1 }}
			/>
		</Suspense>
	) : (
		<></>
	);
};

export default withErrorBoundary(TemplateList, {
	FallbackComponent: Error,
	onError: () => displayError(),
});
