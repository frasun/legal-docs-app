import type { PropsWithChildren } from "react";
import "./emptyScreen.style.css";

interface Props {
	/** Call to action text */
	cta?: string;
	/** Link to navigate on CTA click */
	ctaUrl?: string;
}

export default ({ children, ctaUrl, cta }: PropsWithChildren<Props>) => (
	<div className="col-span-full flex flex-col gap-15 items-center justify-center text-italic-md text-black pb-60 pt-60 sm:pt-0 empty-screen">
		{children}
		{ctaUrl && (
			<footer className="flex not-italic">
				<a href={ctaUrl} aria-label={cta} className="btn btn-default">
					{cta}
				</a>
			</footer>
		)}
	</div>
);
