import React, { useEffect, useState } from "react"
import { useQuery, useMutation } from "@apollo/react-hooks"
import { Redirect, useHistory } from "react-router-dom"
import { useForm } from "react-hook-form"
import moment from "moment"
// --------------------------------------------------------------

// queries & mutation ----------------
import {
  GET_EXAM_QUERY,
  GET_EXAMS_QUERY,
  GET_TODAYS_CHUNKS_AND_PROGRESS,
  GET_CALENDAR_CHUNKS,
  CURRENT_USER,
} from "../../graphQL/queries"
import { UPDATE_EXAM_MUTATION } from "../../graphQL/mutations"

// sub-components ----------------
import Label from "../../components/label/Label"
import Button from "../../components/button/Button"
import QueryError from "../../components/error/Error"
import Loading from "../../components/loading/Loading"
import DatePicker from "../../components/datepicker/DatePicker"

// apolloClient cache ----------------
import { client } from "../../apolloClient"

const ExamDetailsEdit = ({ examId }) => {
  let history = useHistory()

  // query ----------------
  const { loading, error } = useQuery(GET_EXAM_QUERY, {
    variables: { id: examId },
  })

  // run query in cache ----------------
  const data = client.readQuery({
    query: GET_EXAM_QUERY,
    variables: { id: examId },
  }).exam

  // date picker ----------------
  const [myExamDate, setMyExamDate] = useState(data.examDate)
  const [myStartDate, setMyStartDate] = useState(data.startDate)

  // parse Date ----------------
  let formExamDate = moment(myExamDate).format("MM/DD/YYYY")
  let formStartDate = moment(myStartDate).format("MM/DD/YYYY")

  let defaultValues = {
    subject: data.subject,
    examDate: moment(data.examDate),
    startDate: moment(data.startDate),
    numberPages: data.numberPages,
    timePerPage: data.timePerPage,
    timesRepeat: data.timesRepeat,
    currentPage: data.currentPage,
    // startPage: data.startPage,
    startPage: 1,
    notes: data.notes,
    pdfLink: data.pdfLink,
  }

  // set default variables in form and make it editable ----------------
  const { register, errors, watch, setValue, handleSubmit } = useForm({
    defaultValues,
  })

  const {
    subject,
    examDate,
    startDate,
    numberPages,
    startPage,
    currentPage,
    timePerPage,
    timesRepeat,
    notes,
    pdfLink,
  } = watch()

  useEffect(() => {
    register({ exam: "subject" })
    register({ exam: "examDate" })
    register({ exam: "startDate" })
    register({ exam: "numberPages" })
    register({ exam: "startPage" })
    register({ exam: "currentPage" })
    register({ exam: "timePerPage" })
    register({ exam: "timesRepeat" })
    register({ exam: "notes" })
    register({ exam: "pdfLink" })
  }, [register])

  // mutation ----------------
  const [updateExam] = useMutation(UPDATE_EXAM_MUTATION, {
    refetchQueries: [
      { query: GET_EXAMS_QUERY },
      { query: GET_TODAYS_CHUNKS_AND_PROGRESS },
      { query: GET_CALENDAR_CHUNKS },
    ],
  })

  // redirects ----------------
  const currentUser = client.readQuery({ query: CURRENT_USER }).currentUser
  if (currentUser === null) {
    return <Redirect to="/login" />
  }

  // loading & error handling ----------------
  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />

  // functions ----------------
  const handleChange = (exam, e) => {
    e.persist()
    setValue(exam, e.target.value)
  }

  const onSubmit = data => {
    handleExam({
      examId,
      data,
      updateExam,
      formExamDate,
      formStartDate,
      history,
    })
  }

  // return ----------------
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <div className="row">
        <div className="col-md-6 form__left">
          <div className="form__element">
            <Label
              htmlFor="subject"
              text="Subject"
              className="form__element__label input-required"
            />
            <input
              className="form__element__input"
              type="text"
              id="subject"
              label="exam_subject"
              value={subject}
              name="subject"
              onChange={handleChange.bind(null, "subject")}
              required
              ref={register({
                required: true,
                minLength: 1,
                maxLength: 50,
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
                <span className="error"> Maximum 50 characters allowed</span>
              )}
          </div>
          <div className="form__container form__container--numbers">
            <div className="form__element">
              <Label
                htmlFor="exam-date"
                text="Exam date"
                className="form__element__label"
              />
              <DatePicker
                onDaySelected={selectedDay => {
                  setMyExamDate(selectedDay)
                }}
                myValue={moment(examDate).format("DD.MM.YYYY")}
                placeholder={moment(examDate).format("DD.MM.YYYY")}
                required={true}
              />
            </div>

            <div className="form__element">
              <Label
                htmlFor="study-start-date"
                text="Start learning on"
                className="form__element__label"
              />
              <DatePicker
                onDaySelected={selectedDay => {
                  setMyStartDate(selectedDay)
                }}
                myValue={moment(startDate).format("DD.MM.YYYY")}
                disabledAfter={moment(myExamDate).toDate()}
                placeholder={moment(startDate).format("DD.MM.YYYY")}
              />
            </div>
          </div>
          <div className="form__container form__container--numbers">
            <div className="form__element">
              <Label
                htmlFor="page-amount"
                text="Number of pages"
                className="form__element__label input-required"
              />
              <input
                className="form__element__input"
                type="number"
                min="0"
                id="page-amount"
                label="exam_page_amount"
                name="numberPages"
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

            {/* TODO: implement */}
            {/* <div className="form__element">
              <Label
                htmlFor="startPage"
                text="Start page"
                className="form__element__label"
              />
              <input
                className="form__element__input"
                type="number"
                min="0"
                id="startPage"
                label="exam_start_page"
                name="startPage"
                onChange={handleChange.bind(null, "startPage")}
                value={startPage}
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
            </div> */}

            <div className="form__element">
              <Label
                htmlFor="currentPage"
                text="Current page"
                className="form__element__label"
              ></Label>
              <input
                className="form__element__input"
                type="text"
                id="currentPage"
                label="exam_current_page"
                name="currentPage"
                onChange={handleChange.bind(null, "currentPage")}
                value={currentPage}
                ref={register({
                  required: false,
                })}
              />
            </div>
          </div>

          <div className="form__container form__container--numbers">
            <div className="form__element">
              <Label
                htmlFor="page-time"
                text="Time per page (min)"
                className="form__element__label input-required"
              ></Label>
              <input
                className="form__element__input"
                type="number"
                min="0"
                id="page-time"
                label="exam_page_time"
                name="timePerPage"
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

            <div className="form__element">
              <Label
                htmlFor="page-repeat"
                text="Repeat"
                className="form__element__label"
              />
              <input
                className="form__element__input"
                type="number"
                id="page-repeat"
                label="exam_page_repeat"
                name="timesRepeat"
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

        <div className="col-md-6 form__right">
          <div className="form__right--top">
            <div className="form__element">
              <Label
                htmlFor="page-notes"
                text="Notes"
                className="form__element__label"
              />
              <textarea
                className="form__element__input"
                id="page-notes"
                label="exam_page_notes"
                name="notes"
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

            {/* TODO: implement */}
            {/* <div className="form__element">
              <Label
                htmlFor="pdf-link"
                text="Pdf link"
                className="form__element__label"
              ></Label>
              <input
                className="form__element__input"
                type="text"
                id="pdf-link"
                label="exam_pdf_upload"
                name="pdfLink"
                onChange={handleChange.bind(null, "pdfLink")}
                value={pdfLink}
                ref={register({
                  required: false,
                })}
              />
            </div> */}
          </div>
        </div>

        <div className="col-md-12">
          <div className="exam-edit-message">
            <p>
              *Please note, after changing the exam date, start date, number of
              pages, start page or repeat value, the today's learning chunk for
              this exam will be recalculated.
            </p>
          </div>
        </div>

        <div className="col-md-12">
          <div className="form__submit exam-edit-button">
            <Button
              className="form__element__btn stan-btn-primary"
              variant="button"
              text="Save"
            />
          </div>
        </div>

        <div className="col-md-12">
          <p className="error graphql-exam-details-edit-error"></p>
        </div>

        <div className="col-md-12" id="success-container-edit-exam">
          <p className="success">the changes were successfully saved</p>
        </div>
      </div>
    </form>
  )
}

export default ExamDetailsEdit

async function handleExam({
  examId,
  data,
  updateExam,
  formExamDate,
  formStartDate,
  history,
}) {
  try {
    const resp = await updateExam({
      variables: {
        id: examId,
        subject: data.subject,
        examDate: formExamDate,
        startDate: formStartDate,
        numberPages: parseInt(data.numberPages),
        timePerPage: parseInt(data.timePerPage),
        timesRepeat: parseInt(data.timesRepeat),
        // startPage: parseInt(data.startPage),
        startPage: 1,
        currentPage: parseInt(data.currentPage),
        notes: data.notes,
        pdfLink: data.pdfLink,
        completed: false,
      },
    })

    if (resp && resp.data && resp.data.updateExam) {
      document.getElementById("success-container-edit-exam").style.display =
        "block"
    } else {
      throw new Error("Cannot edit current exam.")
    }

    // redirect ----------------
    setTimeout(() => {
      history.push("/exams")
    }, 1000)
  } catch (err) {
    let element = document.getElementsByClassName("graphql-error")

    if (err.graphQLErrors && err.graphQLErrors[0]) {
      element[0].innerHTML = err.graphQLErrors[0].message
    } else {
      element[0].innerHTML = err.message
    }
  }
}
