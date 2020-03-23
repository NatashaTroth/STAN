import React from "react"
import { render, getByTestId } from "@testing-library/react"
import TestAddNew from "./TestAddNew"

test("calls onSubmit with data", () => {
  const handleSubmit = jest.fn()
  const { getByLabelText, getByText } = render(
    <TestAddNew onSubmit={handleSubmit} />
  )

  getByLabelText(/subject/i).value = "English"
  //   getByLabelText(/examDate/i).value = "test1234"
  //   getByLabelText(/studyStartDate/i).value = "test1234"
  getByLabelText(/pageAmount/i).value = "850"
  getByLabelText(/pageTime/i).value = "5"
  getByLabelText(/pageRepeat/i).value = "2"
  getByLabelText(/pageNotes/i).value = "test1234"

  getByText(/submit/i).click()

  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(handleSubmit).toHaveBeenCalledWith({
    subject: "English",
    // examDate: "test1234",
    // studyStartDate: "test1234",
    pageAmount: "850",
    pageTime: "5",
    pageRepeat: "2",
    pageNotes: "test1234",
  })
})
