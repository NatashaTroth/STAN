import React from "react"
import { render, getByTestId } from "@testing-library/react"
import TestLogin from "./TestLogin"
import {
  verifyEmail,
  verifyUsername,
  verifyPassword,
} from "../../../../server/helpers/regex"

test("call onSubmit with email and password", () => {
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

// test("input field required", () => {

// });
