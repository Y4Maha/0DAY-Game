import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders 0DAY menu by default", () => {
  render(<App />);
  expect(screen.getByText("0DAY")).toBeInTheDocument();
  expect(screen.getByText(/Play as Attacker/i)).toBeInTheDocument();
});
