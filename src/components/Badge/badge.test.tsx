import { render, screen } from "@testing-library/react";
import Badge, { BadgeStyle } from "./badge";

describe("Badge", () => {
	it("displays default highlight", async () => {
		render(<Badge />);

		const element = screen.getByTestId("badge");

		expect(element.getAttribute("data-style")).toBe("yellow");
	});

	it("displays passed highlight", async () => {
		render(<Badge style={BadgeStyle.purple} />);

		const element = screen.getByTestId("badge");

		expect(element.getAttribute("data-style")).toBe(BadgeStyle.purple);
	});
});
