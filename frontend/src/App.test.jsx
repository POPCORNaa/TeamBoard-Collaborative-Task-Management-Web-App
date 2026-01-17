// import { describe, it, expect } from 'vitest'
// import { render } from '@testing-library/react'
// import App from './App'
//
// describe('App component', () => {
//   it('renders correctly', () => {
//     const { getByText } = render(<App />)
//     expect(getByText(/vite \+ react/i)).toBeTruthy()
//   })
// })

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("App component", () => {
  it("renders correctly", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /vite \+ react/i })
    ).toBeInTheDocument();
    // No clicks here -> no state updates -> no act warnings
  });
});
