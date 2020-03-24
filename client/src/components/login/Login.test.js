import React from "react"
import { render, getByTestId, cleanup } from "@testing-library/react"
import TestLogin from "./TestLogin"
import {
  verifyEmail,
  verifyPassword,
} from "../../../src/helpers/verifyUserInput"

afterEach(cleanup)

test("call onSubmit with correct email and password", () => {
  const handleSubmit = jest.fn()
  const { getByLabelText, getByText } = render(
    <TestLogin onSubmit={handleSubmit} />
  )
  expect(
    verifyEmail((getByLabelText(/email/i).value = "test@test.com"))
  ).toBeTruthy()
  expect(
    verifyPassword((getByLabelText(/password/i).value = "test1234"))
  ).toBeTruthy()
  getByText(/submit/i).click()

  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(handleSubmit).toHaveBeenCalledWith({
    email: "test@test.com",
    password: "test1234",
  })
})

test("call onSubmit with wrong email and password", () => {
  const handleSubmit = jest.fn()
  const { getByLabelText, getByText } = render(
    <TestLogin onSubmit={handleSubmit} />
  )
  expect(verifyEmail((getByLabelText(/email/i).value = "-@&/.com"))).toBeFalsy()
  expect(
    verifyPassword((getByLabelText(/password/i).value = "987654"))
  ).toBeFalsy()
  getByText(/submit/i).click()

  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(handleSubmit).toHaveBeenCalledWith({
    email: "-@&/.com",
    password: "987654",
  })
})

test("verifies required input field for email", () => {
  const { getByTestId } = render(<TestLogin />)
  expect(getByTestId("required-input-email")).toBeRequired()
})

test("verifies required input field for password", () => {
  const { getByTestId } = render(<TestLogin />)
  expect(getByTestId("required-input-password")).toBeRequired()
})

test("verifies button disabled", () => {
  const { getByTestId } = render(<TestLogin />)
  expect(getByTestId("button")).not.toBeDisabled()
})

test("verifies input field attribute", () => {
  const { getByTestId } = render(<TestLogin />)
  const button = getByTestId("button")
  expect(button).toHaveAttribute("type", "submit")
})

test("verifies if button has class", () => {
  const { getByTestId } = render(<TestLogin />)
  const button = getByTestId("button")
  expect(button).toHaveClass("stan-btn-primary")
})

test("verifies if email has focus", () => {
  const { getByTestId } = render(<TestLogin />)
  const input = getByTestId("required-input-email")
  input.focus()
  expect(input).toHaveFocus()
})
