import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import Counter from "./Counter";

describe("Counter", () => {
    test("renders initial value", () => {
        render(<Counter initial={5} />);
        expect(screen.getByTestId("count")).toHaveTextContent("5");
        expect(screen.getByRole("button", { name: /increase/i })).toBeEnabled();
        expect(screen.getByRole("button", { name: /decrease/i })).toBeEnabled();
    });

    test("increments and decrements by step", async () => {
        const user = userEvent.setup();
        render(<Counter initial={0} step={2} />);

        const inc = screen.getByRole("button", { name: /increase/i });
        const dec = screen.getByRole("button", { name: /decrease/i });

        await act(async () => {
            await user.click(inc);
        });
        await screen.findByText("2");

        await act(async () => {
            await user.click(dec);
        });
        await screen.findByText("0");
    });

    test("respects min and max bounds and disables buttons", async () => {
        const user = userEvent.setup();
        render(<Counter initial={0} step={1} min={0} max={2} />);

        const inc = screen.getByRole("button", { name: /increase/i });
        const dec = screen.getByRole("button", { name: /decrease/i });

        expect(screen.getByTestId("count")).toHaveTextContent("0");
        expect(dec).toBeDisabled();

        await act(async () => {
            await user.click(inc);
        });
        await screen.findByText("1");
        expect(dec).toBeEnabled();

        await act(async () => {
            await user.click(inc);
        });
        await screen.findByText("2");
        expect(inc).toBeDisabled();

        await act(async () => {
            await user.click(inc);
        });
        await screen.findByText("2");
    });
});
