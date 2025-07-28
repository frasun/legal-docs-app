import type { PropsWithChildren } from "react";
import "./badge.style.css";

export enum BadgeStyle {
	default = "yellow",
	purple = "purple",
	orange = "orange",
	blue = "blue",
	red = "red",
	green = "green",
}

export enum BadgeSize {
	default = "default",
	medium = "md",
	large = "lg",
	xlarge = "xlg",
}

interface Props {
	/** The visual style of the badge */
	style?: BadgeStyle;
	/** The size of the badge */
	size?: BadgeSize;
}

export default function ({
	children,
	style = BadgeStyle.default,
	size = BadgeSize.default,
}: PropsWithChildren<Props>) {
	return (
		<span
			data-style={style}
			data-size={size}
			className="text-italic-xs text-black inline-block badge"
			data-testid="badge"
		>
			{children}
		</span>
	);
}
