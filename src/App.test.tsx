import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Start Test Match button on initial screen", () => {
  render(<App />);
  expect(screen.getByText(/Start Test Match/i)).toBeInTheDocument();
});
