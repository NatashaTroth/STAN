import React from "react"
import { render, getByTestId, cleanup } from "@testing-library/react"
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
// --------------------------------------------------------------

afterEach(cleanup)

// tests ----------------
test("calls onSubmit with CORRECT data", () => {
  const handleSubmit = jest.fn()
  const { getByLabelText, getByText } = render(
    <TestAddNew onSubmit={handleSubmit} />
  )

  expect(
    verifySubject((getByLabelText(/subject/i).value = "English"))
  ).toBeTruthy()
  //   expect(verifyExamDate((getByLabelText(/examDate/i).value = ""))).toBeTruthy()
  //   expect(
  //     verifyStudyStartDate((getByLabelText(/studyStartDate/i).value = ""))
  //   ).toBeTruthy()
  expect(
    verifyPageAmount((getByLabelText(/pageAmount/i).value = "850"))
  ).toBeTruthy()
  expect(verifyPageTime((getByLabelText(/pageTime/i).value = "5"))).toBeTruthy()
  expect(
    verifyPageRepeat((getByLabelText(/pageRepeat/i).value = "2"))
  ).toBeTruthy()
  expect(
    verifyPageNotes((getByLabelText(/pageNotes/i).value = "test1234"))
  ).toBeTruthy()

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

test("calls onSubmit with WRONG data", () => {
  const handleSubmit = jest.fn()
  const { getByLabelText, getByText } = render(
    <TestAddNew onSubmit={handleSubmit} />
  )

  expect(verifySubject((getByLabelText(/subject/i).value = ""))).toBeFalsy()
  //   expect(verifyExamDate((getByLabelText(/examDate/i).value = ""))).toBeFalsy()
  //   expect(
  //     verifyStudyStartDate((getByLabelText(/studyStartDate/i).value = ""))
  //   ).toBeFalsy()
  expect(
    verifyPageAmount((getByLabelText(/pageAmount/i).value = "achthundert"))
  ).toBeFalsy()
  expect(
    verifyPageTime((getByLabelText(/pageTime/i).value = "drei"))
  ).toBeFalsy()
  expect(
    verifyPageRepeat((getByLabelText(/pageRepeat/i).value = "zwei"))
  ).toBeFalsy()
  expect(verifyPageNotes((getByLabelText(/pageNotes/i).value = ""))).toBeFalsy()

  getByText(/submit/i).click()

  expect(handleSubmit).toHaveBeenCalledTimes(1)
  expect(handleSubmit).toHaveBeenCalledWith({
    subject: "",
    examDate: "",
    studyStartDate: "",
    pageAmount: "achthundert",
    pageTime: "drei",
    pageRepeat: "zwei",
    pageNotes: "",
  })
})

test("verifies input field attribute", () => {
  const { getByTestId } = render(<TestAddNew />)
  const button = getByTestId("button")
  expect(button).toHaveAttribute("type", "submit")
})

test("verifies required input field for subject", () => {
  const { getByTestId } = render(<TestAddNew />)
  expect(getByTestId("required-input-subject")).toBeRequired()
})

test("verifies required input field for exam date", () => {
  const { getByTestId } = render(<TestAddNew />)
  expect(getByTestId("required-input-examdate")).toBeRequired()
})

test("verifies required input field for page amount", () => {
  const { getByTestId } = render(<TestAddNew />)
  expect(getByTestId("required-input-pageamount")).toBeRequired()
})
