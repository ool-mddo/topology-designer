import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders message", () => {
  render(<App />);
  const element = screen.getByText(/Visualizer/i);
  expect(element).toBeInTheDocument();
});
