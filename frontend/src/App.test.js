import { render, screen, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

test("renders header with logo text", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  const headerElement = screen.getByRole("banner");

  const logoElement = within(headerElement).getByText(/nutriplan/i);

  expect(logoElement).toBeInTheDocument();
});
