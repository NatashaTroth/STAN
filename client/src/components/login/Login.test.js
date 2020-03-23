import React from "react"
import { render, getByTestId } from "@testing-library/react"
import TestLogin from "./TestLogin"

test("calls onSubmit with email and password", () => {
  const handleSubmit = jest.fn()
  const { getByLabelText, getByText } = render(
    <TestLogin onSubmit={handleSubmit} />
  )

  getByLabelText(/email/i).value = "test@test.com"
  getByLabelText(/password/i).value = "test1234"

  getByText(/submit/i).click()

  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(handleSubmit).toHaveBeenCalledWith({
    email: "test@test.com",
    password: "test1234",
  })
})
