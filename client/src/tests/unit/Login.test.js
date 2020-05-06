import React from "react"
import { render } from "@testing-library/react"

import Login from "../../components/login/TestLogin"

// unit tests - login component
it("renders the given label field", () => {
  const { getByLabelText } = render(<Login />)

  expect(getByLabelText(/Email/i)).toBeInTheDocument()
})

it("verifies required input field for email", () => {
  const { getByTestId } = render(<Login />)
  expect(getByTestId("required-input-email")).toBeRequired()
})

it("verifies button attribute", () => {
  const { getByTestId } = render(<Login />)
  const button = getByTestId("button")
  expect(button).toHaveAttribute("type", "submit")
})
