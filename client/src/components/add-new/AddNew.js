import React, { useState, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/react-hooks"
import { GET_USERS_QUERY, GET_EXAMS_QUERY } from "../../graphQL/queries"
import { ADD_EXAM_MUTATION } from "../../graphQL/mutations"
import { useForm } from "react-hook-form"
// --------------------------------------------------------------

// components ----------------
import Label from "../../components/label/Label"
import Input from "../../components/input/Input"
import Textarea from "../../components/textarea/Textarea"
import Button from "../../components/button/Button"

function AddNew() {
  // form specific ----------------
  const { register, errors, handleSubmit } = useForm()

  const onSubmit = data => {
    addExam({
      variables: {
        subject: data.exam_subject,
        examDate: data.exam_date,
        startDate: data.exam_start_date,
        numberPages: parseInt(data.exam_page_amount),
        timePerPage: parseInt(data.exam_page_time),
        currentPage: parseInt(data.exam_page_repeat),
        notes: data.exam_page_notes,
        pdfLink: data.exam_pdf_upload,
        completed: false,
        userId: "5e2f54c374fe3c404f9429b7",
      },
      refetchQueries: [{ query: GET_EXAMS_QUERY }],
    })
  }

  // query ----------------
  const { loading, error, data } = useQuery(GET_USERS_QUERY)

  // mutation ----------------
  const [addExam, { mutationData }] = useMutation(ADD_EXAM_MUTATION)

  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

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
              // onSubmit={handleSubmit}
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
                      className="add-new__form__element__input"
                      type="text"
                      id="subject"
                      label="exam_subject"
                      placeholder="Math"
                      required
                      ref={register({
                        required: true,
                        minLength: 1,
                        maxLength: 20,
                      })}
                    />
                    {errors.exam_subject &&
                      errors.exam_subject.type === "required" && (
                        <span className="error">This field is required</span>
                      )}
                    {errors.exam_subject &&
                      errors.exam_subject.type === "maxLength" &&
                      errors.exam_subject.type === "minLength" && (
                        <span className="error">
                          {" "}
                          The input needs to be between 1 and 20 characters
                        </span>
                      )}
                  </div>

                  <div className="add-new__form__container">
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
                        placeholder="DD/MM/YYYY"
                        required
                        ref={register({
                          required: true,
                        })}
                      />
                      {errors.exam_date &&
                        errors.exam_date.type === "required" && (
                          <span className="error">This field is required</span>
                        )}
                    </div>

                    <div className="add-new__form__element">
                      <Label
                        for="study-start-date"
                        text="Start learning on"
                        className="add-new__form__element__label"
                      ></Label>
                      <Input
                        className="add-new__form__element__input"
                        type="date"
                        id="study-start-date"
                        label="exam_study_start_date"
                        placeholder="DD/MM/YYYY"
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

                    <div className="add-new__form__element">
                      <Label
                        for="page-time"
                        text="Time per page (min)"
                        className="add-new__form__element__label"
                      ></Label>
                      <Input
                        className="add-new__form__element__input"
                        type="number"
                        min="0"
                        id="page-time"
                        label="exam_page_time"
                        placeholder="5 min"
                        ref={register({
                          required: false,
                          min: 1,
                          max: 600,
                        })}
                      />
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

                <div className="col-md-6 add-new__right">
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

                  {/* TODO: implement file link or upload */}
                  {/* <div className="add-new__form__element">
                    <Label
                      for="pdf-upload"
                      text="Upload PDF file"
                      className="add-new__form__element__label"
                    ></Label>
                    <Input
                      className="add-new__form__element__input"
                      type="file"
                      accept="application/pdf, .pdf"
                      id="pdf-upload"
                      label="exam_pdf_upload"
                      ref={register({
                        required: false,
                      })}
                    />
                  </div> */}

                  <div className="add-new__form__submit">
                    <Button
                      className="add-new__form__element__btn stan-btn-primary"
                      variant="button"
                      text="Add"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNew
