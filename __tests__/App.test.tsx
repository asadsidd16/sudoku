import React from "react";
import { render } from "@testing-library/react-native";
import App from "../App";

describe("App", () => {
  it("renders the Sudoku header", () => {
    const { getByText } = render(<App />);
    expect(getByText("Sudoku")).toBeTruthy();
  });

  it("renders the finished button", () => {
    const { getByText } = render(<App />);
    expect(getByText("Finished")).toBeTruthy();
  });

  it("renders the reset button", () => {
    const { getByText } = render(<App />);
    expect(getByText("Reset")).toBeTruthy();
  });
});
