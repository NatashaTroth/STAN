import React, { useState } from "react"
import { useMutation } from "@apollo/react-hooks"
import { useForm } from "react-hook-form"
import moment from "moment"
// --------------------------------------------------------------

// queries ----------------
import {
  GET_EXAMS_QUERY,
  GET_TODAYS_CHUNKS_AND_PROGRESS,
  GET_CALENDAR_CHUNKS,
  GET_EXAMS_COUNT,
} from "../../graphQL/queries"

// mutations ----------------
import { ADD_EXAM_MUTATION } from "../../graphQL/mutations"

// components ----------------
import Label from "../../components/label/Label"
import Input from "../../components/input/Input"
import Textarea from "../../components/textarea/Textarea"
import Button from "../../components/button/Button"
import DatePicker from "../../components/datepicker/DatePicker"

// react-bootstrap ----------------
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

// helpers ----------------
import { filteredLinks } from "../../helpers/mascots"

function AddNew() {
  // mutation ----------------
  const [addExam] = useMutation(ADD_EXAM_MUTATION, {
    refetchQueries: [
      { query: GET_EXAMS_QUERY },
      { query: GET_TODAYS_CHUNKS_AND_PROGRESS },
      { query: GET_CALENDAR_CHUNKS },
      { query: GET_EXAMS_COUNT },
    ],
  })

  // state ----------------
  const [inputFields, setInputFields] = useState([""])

  // form specific ----------------
  const { register, errors, handleSubmit, reset } = useForm()

  // date picker ----------------
  let today = new Date()
  const [myExamDate, setMyExamDate] = useState(today)
  const [myStartDate, setMyStartDate] = useState(today)

  // parse Date ----------------
  let formExamDate = moment(myExamDate).format("MM/DD/YYYY")
  let formStartDate = moment(myStartDate).format("MM/DD/YYYY")
  // -----------------------------

  const newLinks = filteredLinks(inputFields)
  const onSubmit = formData => {
    handleExam({
      formData,
      addExam,
      formExamDate,
      formStartDate,
      newLinks,
      reset,
    })
  }

  // functions ----------------
  const handleInputChange = (index, event) => {
    const values = [...inputFields]
    if (event.target.name === "study-links") {
      values[index] = event.target.value
    }
    setInputFields(values)
  }

  const handleAddFields = () => {
    const values = [...inputFields]
    values.push([""])
    setInputFields(values)
  }

  const handleRemoveFields = index => {
    const values = [...inputFields]
    values.splice(index, 1)
    setInputFields(values)
  }

  // return ----------------
  return (
    <div className="add-new box-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3 className="add-new__heading">Exam details</h3>
          </div>
          <div className="col-md-12">
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="add-exam"
              className="form"
            >
              <div className="row">
                <div className="col-md-6 form__left">
                  <div className="form__element">
                    <Label
                      for="subject"
                      text="Subject"
                      className="form__element__label input-required subject-label"
                    />
                    <Input
                      className="form__element__input"
                      type="text"
                      id="subject"
                      label="exam_subject"
                      placeholder="Math"
                      required
                      ref={register({
                        required: true,
                        minLength: 1,
                        maxLength: 50,
                      })}
                    />
                    {errors.exam_subject &&
                      errors.exam_subject.type === "required" && (
                        <span className="error">This field is required</span>
                      )}
                    {errors.exam_subject &&
                      errors.exam_subject.type === "minLength" && (
                        <span className="error">
                          {" "}
                          Minimum 1 character required
                        </span>
                      )}
                    {errors.exam_subject &&
                      errors.exam_subject.type === "maxLength" && (
                        <span className="error">
                          {" "}
                          Maximum 50 characters allowed
                        </span>
                      )}
                  </div>
                  <div className="form__container form__container--numbers">
                    <div className="form__element">
                      <Label
                        for="exam-date"
                        text="Exam date"
                        className="form__element__label input-required"
                      ></Label>
                      <DatePicker
                        onDaySelected={selectedDay => {
                          setMyExamDate(selectedDay)
                        }}
                        placeholder="DD.MM.YYYY"
                        required={true}
                      />
                    </div>

                    <div className="form__element">
                      <div className="info-box-label">
                        <Label
                          for="study-start-date"
                          text="Start learning on"
                          className="form__element__label input-required"
                        ></Label>

                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={
                            <Tooltip>
                              The date you want to start studying
                            </Tooltip>
                          }
                        >
                          <span className="info-circle">i</span>
                        </OverlayTrigger>
                      </div>

                      <DatePicker
                        onDaySelected={selectedDay => {
                          setMyStartDate(selectedDay)
                        }}
                        disabledAfter={myExamDate}
                        placeholder="DD.MM.YYYY"
                        required={true}
                      />
                    </div>
                  </div>
                  <div className="form__container form__container--numbers">
                    <div className="form__element">
                      <div className="info-box-label">
                        <Label
                          for="page-amount"
                          text="Number of pages"
                          className="form__element__label input-required"
                        ></Label>
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={
                            <Tooltip>
                              How many different pages you have to learn
                            </Tooltip>
                          }
                        >
                          <span className="info-circle">i</span>
                        </OverlayTrigger>
                      </div>

                      <Input
                        className="form__element__input"
                        type="number"
                        min="0"
                        id="page-amount"
                        label="exam_page_amount"
                        placeholder="829"
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

                    {/* <div className="form__element">
                      <Label
                        for="page-current"
                        text="Start page"
                        className="form__element__label"
                      ></Label>
                      <Input
                        className="form__element__input"
                        type="number"
                        min="0"
                        id="page-current"
                        label="exam_page_current"
                        placeholder="1"
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
                  </div>

                  <div className="form__container form__container--numbers">
                    <div className="form__element">
                      <div className="info-box-label">
                        <Label
                          for="page-time"
                          text="Time per page"
                          className="form__element__label input-required"
                        ></Label>
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={
                            <Tooltip>
                              Average time it takes you to learn a page
                            </Tooltip>
                          }
                        >
                          <span className="info-circle">i</span>
                        </OverlayTrigger>
                      </div>

                      <Input
                        className="form__element__input"
                        type="number"
                        min="0"
                        id="page-time"
                        label="exam_page_time"
                        placeholder="5 min"
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
                      <div className="info-box-label">
                        <Label
                          for="page-repeat"
                          text="Repeat"
                          className="form__element__label"
                        ></Label>
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 250, hide: 400 }}
                          overlay={
                            <Tooltip>
                              How many times you want to study each page
                            </Tooltip>
                          }
                        >
                          <span className="info-circle">i</span>
                        </OverlayTrigger>
                      </div>

                      <Input
                        className="form__element__input"
                        type="number"
                        id="page-repeat"
                        label="exam_page_repeat"
                        placeholder="2 times"
                        ref={register({
                          required: false,
                          min: 1,
                          max: 1000,
                        })}
                      />
                    </div>
                    {errors.exam_page_repeat &&
                      errors.exam_page_repeat.type === "max" && (
                        <span className="error">
                          {" "}
                          The maximum is 1000 repeats
                        </span>
                      )}
                    {errors.exam_page_repeat &&
                      errors.exam_page_repeat.type === "min" && (
                        <span className="error">
                          Only positive numbers are allowed
                        </span>
                      )}
                  </div>
                </div>

                <div className="col-md-6 form__right">
                  <div className="form__right--top">
                    <div className="form__element">
                      <Label
                        for="page-notes"
                        text="Notes"
                        className="form__element__label"
                      ></Label>
                      <Textarea
                        className="form__element__input"
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

                    <div className="form__current-study-links">
                      <div className="form__element">
                        <div className="info-box-label">
                          <Label
                            htmlFor="study-new-links"
                            text="Study material links"
                            className="form__element__label"
                          />
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={
                              <Tooltip>
                                Links to your online study documents (e.g.
                                slides, pdfs...)
                              </Tooltip>
                            }
                          >
                            <span className="info-circle">i</span>
                          </OverlayTrigger>
                        </div>
                      </div>
                      {inputFields.map((inputField, index) => (
                        <div
                          key={`${index}-newUrls`}
                          className="form__study-links"
                        >
                          <div className="form__element form__study-links--input">
                            <input
                              className="form__element__input"
                              type="url"
                              id="study-links"
                              name="study-links"
                              placeholder="https://example.com/math"
                              label="exam_links_upload"
                              onChange={event =>
                                handleInputChange(index, event)
                              }
                              ref={register({
                                required: false,
                                pattern:
                                  "/(ftp|http|https)://(w+:{0,1}w*@)?(S+)(:[0-9]+)?(/|/([w#!:.?+=&%@!-/]))?/",
                              })}
                            />
                          </div>

                          <div className="form__study-links--buttons">
                            <button
                              type="button"
                              onClick={() => handleRemoveFields(index)}
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddFields()}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form__submit">
                    <Button
                      className="form__element__btn stan-btn-primary"
                      variant="button"
                      text="Add"
                    />
                  </div>
                </div>
              </div>
            </form>
            <div>
              <p className="error graphql-error"></p>
            </div>
          </div>
          <div className="col-md-12" id="success-container-add-new">
            <p className="success">the exam was successfully added</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNew

async function handleExam({
  formData,
  addExam,
  formExamDate,
  formStartDate,
  newLinks,
  reset,
}) {
  try {
    const resp = await addExam({
      variables: {
        subject: formData.exam_subject,
        examDate: formExamDate,
        startDate: formStartDate,
        numberPages: parseInt(formData.exam_page_amount),
        // startPage: parseInt(formData.exam_page_current),
        startPage: 1,
        timePerPage: parseInt(formData.exam_page_time),
        timesRepeat: parseInt(formData.exam_page_repeat),
        notes: formData.exam_page_notes,
        studyMaterialLinks: newLinks,
        completed: false,
      },
    })

    if (resp && resp.data && resp.data.addExam) {
      // success message ----------------
      document.getElementById("success-container-add-new").style.display =
        "block"

      reset({}) // reset form data
    } else {
      // displays server error (backend)
      throw new Error("The exam could not be added, please check your input")
    }
  } catch (err) {
    let element = document.getElementsByClassName("graphql-error")

    if (err.graphQLErrors && err.graphQLErrors[0]) {
      element[0].innerHTML = err.graphQLErrors[0].message
    } else {
      element[0].innerHTML = err.message
    }
  }
}
