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
import Button from "../../components/button/Button"

// TODO: update current exam with mutation
const ExamDetailsEdit = ({ examId }) => {
  // variables ----------------
  let defaultValues
  const { register, errors, handleSubmit } = useForm({ defaultValues })

  // query ----------------
  const { loading, error, data } = useQuery(GET_EXAM_QUERY, {
    variables: { id: examId },
  })

  // mutation ----------------
  //  const [updateExam] = useMutation()

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  if (loading) return <p className="loading">loading...</p>
  if (error) return <p>error...</p>
  if (data && data.exam) {
    defaultValues = {
      subject: data.exam.subject,
      examDate: new Date(data.exam.examDate).toISOString().substr(0, 10),
      startDate: new Date(data.exam.startDate).toISOString().substr(0, 10),
      numberPages: data.exam.numberPages,
      timePerPage: data.exam.timePerPage,
      timesRepeat: data.exam.timesRepeat,
      currentPage: data.exam.currentPage,
      notes: data.exam.notes,
      pdfLink: data.exam.pdfLink,
    }
  }

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
              htmlFor="subject"
              text="Subject"
              className="add-new__form__element__label input-required"
            />
            <input
              className="add-new__form__element__input examEdit__form__left--subject"
              type="text"
              id="subject"
              label="exam_subject"
              defaultValue={defaultValues.subject}
              name="subject"
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
              />
              <input
                className="add-new__form__element__input"
                type="date"
                id="exam-date"
                label="exam_date"
                defaultValue={defaultValues.examDate}
                name="examDate"
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
              />
              <input
                className="add-new__form__element__input"
                type="date"
                id="study-start-date"
                label="exam_start_date"
                defaultValue={defaultValues.startDate}
                name="startDate"
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
              />
              <input
                className="add-new__form__element__input"
                type="number"
                min="0"
                id="page-amount"
                label="exam_page_amount"
                defaultValue={defaultValues.numberPages}
                name="numberPages"
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
              />
              <input
                className="add-new__form__element__input"
                type="number"
                min="0"
                id="page-current"
                label="exam_page_current"
                defaultValue={defaultValues.currentPage}
                name="currentPage"
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
              <input
                className="add-new__form__element__input"
                type="number"
                min="0"
                id="page-time"
                label="exam_page_time"
                defaultValue={defaultValues.timePerPage}
                name="timePerPage"
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
              />
              <input
                className="add-new__form__element__input"
                type="number"
                id="page-repeat"
                label="exam_page_repeat"
                defaultValue={defaultValues.timesRepeat}
                name="timesRepeat"
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
              />
              <textarea
                className="add-new__form__element__input"
                id="page-notes"
                label="exam_page_notes"
                defaultValue={defaultValues.notes}
                name="notes"
                ref={register({
                  required: false,
                  maxLength: 100000000,
                })}
              />
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
              <input
                className="add-new__form__element__input"
                type="text"
                id="pdf-link"
                label="exam_pdf_upload"
                defaultValue={defaultValues.pdfLink}
                name="pdfLink"
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
