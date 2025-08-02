import type { Question } from "@type";
import routes from "@utils/routes";
import { useState, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import CloseIcon from "../icons/ts/close";
import ArrowIcon from "../icons/ts/arrow";

interface QuestionModal {
	index: Question["index"];
	title?: string;
	documentId: string;
	current: string;
}

const DIV_A = "flex gap-10 items-center border-t border-black/30 px-10 py-8";
const SPAN = "flex-grow flex items-baseline gap-10";

const QuestionList = ({ index, documentId, current }: QuestionModal) => (
	<section>
		<header className="pb-8">
			<h6 className="text-sans-xs text-black/50">Lista pytań</h6>
		</header>
		{index.map(({ slug, title }, index) => (
			<Item
				key={`item-${index}`}
				slug={slug}
				title={title}
				index={index}
				current={current}
				documentId={documentId}
			/>
		))}
		<a
			href={`${document.location.origin}${routes.DOCUMENTS}/${documentId}${routes.SUMMARY}`}
			className={`${DIV_A} hover:bg-black/5 hover:text-black`}
		>
			<span className={SPAN}>Podsumowanie</span>
			<ArrowIcon />
		</a>
	</section>
);

interface ItemProps {
	slug: string;
	title: string;
	current: string;
	index: number;
	documentId: string;
}

const Item = ({ slug, title, current, index, documentId }: ItemProps) => (
	<>
		{slug === current ? (
			<div className={`${DIV_A} text-active`} key={`item-${index}`}>
				<span className={SPAN}>
					<small className="text-sans-xs">{index + 1}.</small>
					{title}
				</span>
			</div>
		) : (
			<a
				href={`${document.location.origin}/dokumenty/${documentId}/${slug}`}
				className={`${DIV_A} hover:bg-black/5 hover:text-black`}
				key={`item-${index}`}
			>
				<span className={SPAN}>
					<small className="text-sans-xs">{index + 1}.</small>
					{title}
				</span>
				<ArrowIcon />
			</a>
		)}
	</>
);

export default ({
	title,
	index,
	documentId,
	current,
	children,
}: PropsWithChildren<QuestionModal>) => {
	const [isVisible, setIsVisibile] = useState(false);
	return (
		<>
			<button
				onClick={() => setIsVisibile(true)}
				aria-label="Pokaż listę pytań"
				className="btn btn-alt"
			>
				{children || "Pokaż listę pytań"}
			</button>
			{isVisible &&
				createPortal(
					<Modal modalTitle={title} onClose={() => setIsVisibile(false)}>
						<QuestionList
							index={index}
							documentId={documentId}
							current={current}
						/>
					</Modal>,
					document.body
				)}
		</>
	);
};

interface ModalProps {
	modalTitle?: string;
	onClose?: () => void;
}

const Modal = ({
	modalTitle,
	children,
	onClose,
}: PropsWithChildren<ModalProps>) => {
	const handleClose = () => {
		onClose && onClose();
	};
	return (
		<>
			<div className="transition-transform duration-300 -translate-y-1/2 modal-open fixed w-[90%] m-auto max-w-[550px] max-h-[90%] overflow-y-auto z-max top-[50%] left-[50%] -translate-x-1/2 flex flex-col md:flex-row justify-start md:justify-center bg-yellow rounded-sm border border-black shadow-3 -translate-y-[200vh] text-sans-md text-black">
				<section className="flex-grow flex flex-col gap-15 px-20 py-30">
					<button
						onClick={handleClose}
						aria-label="Zamknij"
						className="absolute top-15 right-15 z-50 btn btn-alt btn-icon"
					>
						<CloseIcon />
					</button>
					{modalTitle && (
						<header className="pr-60 text-italic-md w-full text-black">
							<h3>{modalTitle}</h3>
						</header>
					)}
					{children}
				</section>
			</div>
			<div
				className="fixed left-0 top-0 right-0 bottom-0 bg-black/10 opacity-0 cursor-n-resize z-menu transition-opacity opacity-100"
				onClick={handleClose}
			></div>
		</>
	);
};
