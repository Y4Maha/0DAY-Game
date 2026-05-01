import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders 0DAY title", () => {
  render(<App />);
  expect(screen.getByText("0DAY")).toBeInTheDocument();
});
