import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/react-hooks"
import { GET_USERS_QUERY, GET_EXAMS_QUERY } from "../../graphQL/queries"
import { ADD_EXAM_MUTATION } from "../../graphQL/mutations"
// --------------------------------------------------------------

// components ----------------
import Label from "../../components/label/Label"
import Input from "../../components/input/Input"
import Textarea from "../../components/textarea/Textarea"
import Button from "../../components/button/Button"

function AddNew() {
  // query ----------------
  const { loading, error, data } = useQuery(GET_USERS_QUERY)
  // state handling ----------------
  const [exam_subject, setExamSubject] = useState("")
  const [exam_date, setExamDate] = useState("")
  const [exam_start_date, setExamStartDate] = useState("")
  const [exam_page_amount, setExamPageAmount] = useState("")
  const [exam_page_time, setExamPageTime] = useState("")
  const [exam_page_repeat, setExamPageRepeat] = useState("")
  const [exam_page_notes, setExamPageNotes] = useState("")
  const [exam_pdf_upload, setExamPdfUpload] = useState("")

  const handleSubmit = evt => {
    evt.preventDefault()
  }

  // mutation ----------------
  const [addExam, { mutationData }] = useMutation(ADD_EXAM_MUTATION)

  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  // return ----------------
  return (
    <div className="box-container">
      <div className="box-container-inner">
        <div className="add-new box-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <h3 className="add-new__heading">Exam details</h3>
              </div>
              <div className="col-md-12">
                <form
                  onSubmit={handleSubmit}
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
                          name="exam_subject"
                          placeholder="Math"
                          value={exam_subject}
                          maxLength={50}
                          onChange={evt =>
                            setExamSubject(evt.target.value.slice(0, 50))
                          }
                          required
                        />
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
                            name="exam_date"
                            placeholder="DD/MM/YYYY"
                            value={exam_date}
                            maxLength={null}
                            onChange={evt => setExamDate(evt.target.value)}
                            required
                          />
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
                            name="exam_study_start_date"
                            placeholder="DD/MM/YYYY"
                            value={exam_start_date}
                            maxLength={null}
                            onChange={evt => setExamStartDate(evt.target.value)}
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
                            id="page-amount"
                            name="exam_study_start_date"
                            placeholder="829"
                            value={exam_page_amount}
                            maxLength={10000}
                            onChange={evt =>
                              setExamPageAmount(
                                evt.target.value.slice(0, 10000)
                              )
                            }
                            required
                          />
                        </div>

                        <div className="add-new__form__element">
                          <Label
                            for="page-time"
                            text="Time per page (h:m)"
                            className="add-new__form__element__label"
                          ></Label>
                          <Input
                            className="add-new__form__element__input"
                            type="time"
                            id="page-time"
                            name="exam_page_time"
                            placeholder="5 min"
                            value={exam_page_time}
                            maxLength={null}
                            onChange={evt => setExamPageTime(evt.target.value)}
                          />
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
                            name="exam_page_repeat"
                            placeholder="2 times"
                            value={exam_page_repeat}
                            maxLength={50}
                            onChange={evt =>
                              setExamPageRepeat(evt.target.value.slice(0, 50))
                            }
                          />
                        </div>
                      </div>

                      <div className="add-new__form__element">
                        <Label
                          for="page-notes"
                          text="Notes"
                          className="add-new__form__element__label"
                        ></Label>
                        <Textarea
                          className="add-new__form__element__input"
                          id="page-notes"
                          name="exam_page_notes"
                          placeholder="..."
                          value={exam_page_notes}
                          maxLength={100000}
                          onChange={evt =>
                            setExamPageNotes(evt.target.value.slice(0, 100000))
                          }
                        ></Textarea>
                      </div>
                    </div>

                    <div className="col-md-6 add-new__right">
                      <div className="add-new__form__element">
                        <Label
                          for="pdf-upload"
                          text="Upload PDF file"
                          className="add-new__form__element__label"
                        ></Label>
                        <Input
                          className="add-new__form__element__input"
                          type="file"
                          accept=".pdf"
                          id="pdf-upload"
                          name="exam_pdf_upload"
                          value={exam_pdf_upload}
                          onChange={evt => setExamPdfUpload(evt.target.value)}
                        />
                      </div>

                      <div className="add-new__form__submit">
                        <Button
                          className="add-new__form__element__btn stan-btn-primary"
                          variant="button"
                          text="Add"
                          onClick={e => {
                            e.preventDefault()
                            // console.log("in onclick")
                            addExam({
                              variables: {
                                subject: exam_subject,
                                examDate: exam_date,
                                startDate: exam_start_date,
                                numberPages: exam_page_amount,
                                timePerPage: exam_page_time,
                                currentPage: exam_page_repeat,
                                notes: exam_page_notes,
                                pdfLink: exam_pdf_upload,
                                completed: false,
                              },
                              refetchQueries: [{ query: GET_EXAMS_QUERY }],
                            })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="box-right"></div>
      </div>
      <div className="box-bottom"></div>
    </div>
  )
}

export default AddNew
