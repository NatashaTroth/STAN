import React, { useEffect } from "react"
import { useQuery, useMutation } from "@apollo/react-hooks"
import { Redirect } from "react-router"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// queries & mutation ----------------
import { GET_EXAM_QUERY } from "../../graphQL/queries"
import {
  UPDATE_EXAM_MUTATION,
  DELETE_EXAM_MUTATION,
} from "../../graphQL/mutations"

// sub-components ----------------
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"

// TODO: update current exam with mutation
const ExamDetailsEdit = ({ examId }) => {
  // variables & set default variables in form ----------------
  let defaultValues
  const { register, errors, watch, setValue, handleSubmit } = useForm({
    defaultValues,
  })

  const {
    subject,
    examDate,
    startDate,
    numberPages,
    currentPage,
    timePerPage,
    timesRepeat,
    notes,
    pdfLink,
  } = watch()

  useEffect(() => {
    register({ name: "subject" })
    register({ name: "examDate" })
    register({ name: "startDate" })
    register({ name: "numberPages" })
    register({ name: "currentPage" })
    register({ name: "timePerPage" })
    register({ name: "timesRepeat" })
    register({ name: "notes" })
    register({ name: "pdfLink" })
  }, [register])

  const handleChange = (name, e) => {
    e.persist()
    setValue(name, e.target.value)
  }

  // query ----------------
  const { loading, error, data } = useQuery(GET_EXAM_QUERY, {
    variables: { id: examId },
  })

  // mutations ----------------
  const [updateExam] = useMutation(UPDATE_EXAM_MUTATION)
  const [deleteExam] = useMutation(DELETE_EXAM_MUTATION)

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
  const onSubmit = async formData => {
    handleExam({ examId, formData, updateExam })
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
              value={subject}
              onChange={handleChange.bind(null, "subject")}
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
                htmlFor="exam-date"
                text="Exam date"
                className="add-new__form__element__label input-required"
              />
              <input
                className="add-new__form__element__input"
                type="date"
                id="exam-date"
                label="exam_date"
                value={examDate}
                onChange={handleChange.bind(null, "examDate")}
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
                htmlFor="study-start-date"
                text="Start learning on"
                className="add-new__form__element__label input-required"
              />
              <input
                className="add-new__form__element__input"
                type="date"
                id="study-start-date"
                label="exam_start_date"
                onChange={handleChange.bind(null, "startDate")}
                value={startDate}
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
                htmlFor="page-amount"
                text="Amount of pages"
                className="add-new__form__element__label input-required"
              />
              <input
                className="add-new__form__element__input"
                type="number"
                min="0"
                id="page-amount"
                label="exam_page_amount"
                onChange={handleChange.bind(null, "numberPages")}
                value={numberPages}
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
                htmlFor="page-current"
                text="Start page"
                className="add-new__form__element__label"
              />
              <input
                className="add-new__form__element__input"
                type="number"
                min="0"
                id="page-current"
                label="exam_page_current"
                onChange={handleChange.bind(null, "currentPage")}
                value={currentPage}
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
                htmlFor="page-time"
                text="Time per page (min)"
                className="add-new__form__element__label input-required"
              ></Label>
              <input
                className="add-new__form__element__input"
                type="number"
                min="0"
                id="page-time"
                label="exam_page_time"
                onChange={handleChange.bind(null, "timePerPage")}
                value={timePerPage}
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
                htmlFor="page-repeat"
                text="Repeat"
                className="add-new__form__element__label"
              />
              <input
                className="add-new__form__element__input"
                type="number"
                id="page-repeat"
                label="exam_page_repeat"
                onChange={handleChange.bind(null, "timesRepeat")}
                value={timesRepeat}
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
                htmlFor="page-notes"
                text="Notes"
                className="add-new__form__element__label"
              />
              <textarea
                className="add-new__form__element__input"
                id="page-notes"
                label="exam_page_notes"
                onChange={handleChange.bind(null, "notes")}
                value={notes}
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
                htmlFor="pdf-link"
                text="Pdf link"
                className="add-new__form__element__label"
              ></Label>
              <input
                className="add-new__form__element__input"
                type="text"
                id="pdf-link"
                label="exam_pdf_upload"
                onChange={handleChange.bind(null, "pdfLink")}
                value={pdfLink}
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

async function handleExam({ examId, formData, updateExam }) {
  try {
    const resp = await updateExam({
      id: examId,
      subject: formData.subject,
      examDate: formData.examDate,
      startDate: formData.startDate,
      numberPages: parseInt(formData.numberPages),
      timePerPage: parseInt(formData.timePerPage),
      timesRepeat: parseInt(formData.timesRepeat),
      startPage: parseInt(formData.exam_page_current),
      notes: formData.notes,
      pdfLink: formData.pdfLink,
      completed: false,
    })

    // (refetchQueries: [
    //   // { query: GET_EXAMS_QUERY },
    // // { query: GET_TODAYS_CHUNKS },
    // // { query: GET_CALENDAR_CHUNKS }
    // ]

    if (resp && resp.data && resp.data.updateMascot) {
      console.log("success: saved exam")
    } else {
      throw new Error("failed: saved exam")
    }

    // redirect
    window.location.reload()
  } catch (err) {
    //TODO: USER DEN ERROR MITTEILEN
    console.error(err.message)
    // console.log(err)
  }
}
