import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Landing page by default with Play Now", () => {
  render(<App />);
  expect(screen.getByLabelText("0DAY")).toBeInTheDocument();
  expect(screen.getByText(/Play Now/i)).toBeInTheDocument();
});
