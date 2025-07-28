import type { TemplateShort } from "@type";
import formatNumber from "@utils/number";
import Badge from "@components/Badge/badge";
import Icon from "@icons/p";

type Props = Omit<TemplateShort, "draft"> &
	Partial<Pick<TemplateShort, "draft">>;

export default function ({ slug, title, draft, price, categories }: Props) {
	return (
		<a
			href={slug}
			title={title}
			className="grid grid-rows-[1fr_auto_auto] gap-5 border border-black/30 hover:border-black p-20 pb-10 bg-white hover:bg-black/5 rounded-sm shadow-2 hover:shadow-3 hover:text-black relative min-h-[230px] overflow-hidden;"
		>
			<header className="flex flex-col gap-10 items-start">
				{draft && <Badge>szkic dokumentu</Badge>}
				<h3 className="text-italic-md line-clamp-5 pb-5 text-black">{title}</h3>
			</header>
			<footer className="flex flex-col gap-5 items-end text-right text-sans-xs">
				<h6 className="text-sans-md text-black">
					{price ? `${formatNumber(price)} zł` : "-"}
				</h6>
				{categories.join(", ")}
			</footer>
			<Icon className="absolute bottom-[25px] left-20 fill-black/5" />
		</a>
	);
}
