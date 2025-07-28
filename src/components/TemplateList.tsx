import { useEffect, useState } from "react";
import TemplateGrid from "@components/TemplateGrid";
import type { TemplateShort } from "@type";
import EmptyScreen from "@components/EmptyScreen/emptyScreen";

export default () => {
	const [templates, setTemplates] = useState<TemplateShort[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const controller = new AbortController();

		const fetchTemplates = async (aborted: boolean) => {
			if (aborted) return;

			try {
				const fetchTemplates = await fetch(
					new URL("/api/templates", document.location.origin)
				);

				setLoading(true);

				const templates: TemplateShort[] = await fetchTemplates.json();

				if (templates) {
					setTemplates(templates);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchTemplates(controller.signal.aborted);

		return () => controller.abort();
	}, []);

	return (
		<>
			{templates.length ? (
				<TemplateGrid templates={templates} />
			) : loading ? (
				<p>loading</p>
			) : (
				<EmptyScreen>Brak dokumentów do wyświetlenia</EmptyScreen>
			)}
		</>
	);
};
