import React, { useState } from "react"
import { Redirect, useHistory } from "react-router"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// queries ----------------
import { GET_EXAM_QUERY } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"

// sub-components ----------------
import Label from "../../components/label/Label"
import Input from "../../components/input/Input"
import Textarea from "../../components/textarea/Textarea"
import Button from "../../components/button/Button"

// TODO: update current exam with mutation
// TODO: add old subject values in input field
const ExamDetailsEdit = ({ examId }) => {
  const { register, errors, handleSubmit } = useForm()

  // state ----------------
  const [subject, setSubject] = useState()

  // query ----------------
  const { loading, error, data } = useQuery(GET_EXAM_QUERY, {
    variables: { id: examId },
  })

  // mutation ----------------
  //  const [updateExam] = useMutation()

  // variables ----------------
  let examDetails = []

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  if (loading) return <p className="loading">loading...</p>
  if (error) return <p>error...</p>
  if (data && data.exam) {
    examDetails = {
      subject: data.exam.subject,
      examDate: data.exam.examDate,
      startDate: data.exam.startDate,
      numberPages: data.exam.numberPages,
      timePerPage: data.exam.timePerPage,
      timesRepeat: data.exam.timesRepeat,
      currentPage: data.exam.currentPage,
      notes: data.exam.notes,
      pdfLink: data.exam.pdfLink,
    }
  }

  console.log(subject)

  // form specific ----------------
  const onSubmit = async data => {
    // handleExam({ data, updateExam })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      id="add-exam"
      className="add-new__form"
    >
      <div className="row">
        <div className="col-md-6 add-new__left">
          <div className="add-new__form__element">
            <Label
              for="subject"
              text="Subject"
              className="add-new__form__element__label input-required"
            ></Label>
            <Input
              className="add-new__form__element__input examEdit__form__left--subject"
              type="text"
              id="subject"
              label="exam_subject"
              required
              ref={register({
                required: true,
                minLength: 1,
                maxLength: 20,
              })}
            />
            {errors.exam_subject && errors.exam_subject.type === "required" && (
              <span className="error">This field is required</span>
            )}
            {errors.exam_subject &&
              errors.exam_subject.type === "minLength" && (
                <span className="error"> Minimum 1 character required</span>
              )}
            {errors.exam_subject &&
              errors.exam_subject.type === "maxLength" && (
                <span className="error"> Maximum 20 characters allowed</span>
              )}
          </div>
          <div className="add-new__form__container add-new__form__container--numbers">
            <div className="add-new__form__element">
              <Label
                for="exam-date"
                text="Exam date"
                className="add-new__form__element__label input-required"
              ></Label>
              <Input
                className="add-new__form__element__input"
                type="date"
                id="exam-date"
                label="exam_date"
                required
                ref={register({
                  required: true,
                })}
              />
              {errors.exam_date && errors.exam_date.type === "required" && (
                <span className="error">This field is required</span>
              )}
            </div>

            <div className="add-new__form__element">
              <Label
                for="study-start-date"
                text="Start learning on"
                className="add-new__form__element__label input-required"
              ></Label>
              <Input
                className="add-new__form__element__input"
                type="date"
                id="study-start-date"
                label="exam_start_date"
                required
                ref={register({
                  required: false,
                })}
              />
            </div>
          </div>
          <div className="add-new__form__container add-new__form__container--numbers">
            <div className="add-new__form__element">
              <Label
                for="page-amount"
                text="Amount of pages"
                className="add-new__form__element__label input-required"
              ></Label>
              <Input
                className="add-new__form__element__input"
                type="number"
                min="0"
                id="page-amount"
                label="exam_page_amount"
                required
                ref={register({
                  required: true,
                  min: 1,
                  max: 10000,
                })}
              />
              {errors.exam_page_amount &&
                errors.exam_page_amount.type === "required" && (
                  <span className="error">This field is required</span>
                )}
              {errors.exam_page_amount &&
                errors.exam_page_amount.type === "max" && (
                  <span className="error">The maximum is 10.000</span>
                )}
              {errors.exam_page_amount &&
                errors.exam_page_amount.type === "min" && (
                  <span className="error">
                    Only positive numbers are allowed
                  </span>
                )}
            </div>

            <div className="add-new__form__element">
              <Label
                for="page-current"
                text="Start page"
                className="add-new__form__element__label"
              ></Label>
              <Input
                className="add-new__form__element__input"
                type="number"
                min="0"
                id="page-current"
                label="exam_page_current"
                ref={register({
                  min: 1,
                  max: 10000,
                })}
              />
              {errors.exam_page_amount &&
                errors.exam_page_amount.type === "max" && (
                  <span className="error">The maximum is 10.000</span>
                )}
              {errors.exam_page_amount &&
                errors.exam_page_amount.type === "min" && (
                  <span className="error">
                    Only positive numbers are allowed
                  </span>
                )}
            </div>
          </div>

          <div className="add-new__form__container add-new__form__container--numbers">
            <div className="add-new__form__element">
              <Label
                for="page-time"
                text="Time per page (min)"
                className="add-new__form__element__label input-required"
              ></Label>
              <Input
                className="add-new__form__element__input"
                type="number"
                min="0"
                id="page-time"
                label="exam_page_time"
                ref={register({
                  required: true,
                  min: 1,
                  max: 600,
                })}
                required
              />
              {errors.exam_page_time &&
                errors.exam_page_time.type === "required" && (
                  <span className="error">This field is required</span>
                )}
              {errors.exam_page_time &&
                errors.exam_page_time.type === "max" && (
                  <span className="error">
                    {" "}
                    The maximum is 600 minutes (10 hours)
                  </span>
                )}
              {errors.exam_page_time &&
                errors.exam_page_time.type === "min" && (
                  <span className="error">
                    Only positive numbers are allowed
                  </span>
                )}
            </div>

            <div className="add-new__form__element">
              <Label
                for="page-repeat"
                text="Repeat"
                className="add-new__form__element__label"
              ></Label>
              <Input
                className="add-new__form__element__input"
                type="number"
                id="page-repeat"
                label="exam_page_repeat"
                ref={register({
                  required: false,
                  min: 1,
                  max: 1000,
                })}
              />
            </div>
            {errors.exam_page_repeat &&
              errors.exam_page_repeat.type === "max" && (
                <span className="error"> The maximum is 1000 repeats</span>
              )}
            {errors.exam_page_repeat &&
              errors.exam_page_repeat.type === "min" && (
                <span className="error">Only positive numbers are allowed</span>
              )}
          </div>
        </div>

        <div className="col-md-6 add-new__right examEdit__form__right">
          <div className="examEdit__form__right--top">
            <div className="add-new__form__element">
              <Label
                for="page-notes"
                text="Notes"
                className="add-new__form__element__label"
              ></Label>
              <Textarea
                className="add-new__form__element__input"
                id="page-notes"
                label="exam_page_notes"
                placeholder="..."
                ref={register({
                  required: false,
                  maxLength: 100000000,
                })}
              ></Textarea>
              {errors.exam_page_notes &&
                errors.exam_page_notes.type === "maxLength" && (
                  <span className="error">
                    The maximal length is 100.000.000 characters
                  </span>
                )}
            </div>

            <div className="add-new__form__element examEdit__form__right--top--pdf">
              <Label
                for="pdf-link"
                text="Pdf link"
                className="add-new__form__element__label"
              ></Label>
              <Input
                className="add-new__form__element__input"
                type="text"
                id="pdf-link"
                label="exam_pdf_upload"
                ref={register({
                  required: false,
                })}
              />
            </div>
          </div>

          <div className="add-new__form__submit examEdit__form__right--bottom--btn">
            <Button
              className="add-new__form__element__btn stan-btn-primary"
              variant="button"
              text="Save"
            />
          </div>
        </div>
      </div>
    </form>
  )
}

export default ExamDetailsEdit

async function handleExam({ data, updateExam }) {
  try {
    const resp = await updateExam({
      // variables: {
      //   mascot: data,
      // },
    })

    // const resp = await addExam({
    //   variables: {
    //     subject: formData.exam_subject,
    //     examDate: formData.exam_date,
    //     startDate: formData.exam_start_date,
    //     numberPages: parseInt(formData.exam_page_amount),
    //     startPage: parseInt(formData.exam_page_current),
    //     timePerPage: parseInt(formData.exam_page_time),
    //     timesRepeat: parseInt(formData.exam_page_repeat),
    //     notes: formData.exam_page_notes,
    //     // pdfLink: formData.exam_pdf_upload,
    //     pdfLink: "TODO: CHANGE LATER",
    //     completed: false,
    //   },
    //   refetchQueries: [
    //     { query: GET_EXAMS_QUERY },
    //     { query: GET_TODAYS_CHUNKS },
    //   ],
    // })

    // if (resp && resp.data && resp.data.updateMascot) {
    //   console.log("success: saved new mascot")
    // } else {
    //   throw new Error("failed: saved new mascot")
    // }

    // redirect
    window.location.reload()
  } catch (err) {
    //TODO: USER DEN ERROR MITTEILEN
    console.error(err.message)
    // console.log(err)
  }
}
