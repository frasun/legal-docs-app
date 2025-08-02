import { Suspense, useEffect, useState } from "react";
import TemplateGrid from "@components/TemplateGrid";
import type { DocumentCategory, TemplateShort } from "@type";
import Loading from "@components/Loading";
import { ErrorBoundary } from "react-error-boundary";
import fetchTemplates from "@api/client/templates";
import Error from "@components/Error";

interface Props {
	/** Limit of items to to show */
	limit?: number | string;
	/** A collection of category data */
	categories: DocumentCategory[];
}

export default ({ limit, categories }: Props) => {
	const [templates, setTemplates] = useState<Promise<TemplateShort[]>>();

	useEffect(() => {
		setTemplates(
			fetchTemplates({
				limit: Number(limit),
				categoryList: categories,
			})
		);
	}, []);

	return templates ? (
		<ErrorBoundary FallbackComponent={Error}>
			<Suspense fallback={<Loading />}>
				<TemplateGrid templatesPromise={templates} />
			</Suspense>
		</ErrorBoundary>
	) : (
		<></>
	);
};
