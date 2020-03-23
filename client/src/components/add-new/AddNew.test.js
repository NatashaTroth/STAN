import React from "react"
import { render, getByTestId } from "@testing-library/react"
import TestAddNew from "./TestAddNew"
import {
  verifySubject,
  verifyExamDate,
  verifyStudyStartDate,
  verifyPageAmount,
  verifyPageTime,
  verifyPageRepeat,
  verifyPageNotes,
} from "../../../../server/helpers/regex"

test("calls onSubmit with data", () => {
  const handleSubmit = jest.fn()
  const { getByLabelText, getByText } = render(
    <TestAddNew onSubmit={handleSubmit} />
  )

  getByLabelText(/subject/i).value = "English"
  getByLabelText(/examDate/i).value = ""
  getByLabelText(/studyStartDate/i).value = ""
  getByLabelText(/pageAmount/i).value = "850"
  getByLabelText(/pageTime/i).value = "5"
  getByLabelText(/pageRepeat/i).value = "2"
  getByLabelText(/pageNotes/i).value = "test1234"

  getByText(/submit/i).click()

  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(handleSubmit).toHaveBeenCalledWith({
    subject: "English",
    examDate: "",
    studyStartDate: "",
    pageAmount: "850",
    pageTime: "5",
    pageRepeat: "2",
    pageNotes: "test1234",
  })
})

test("calls onSubmit with WRONG data", () => {})

test("regex implementation", () => {})
