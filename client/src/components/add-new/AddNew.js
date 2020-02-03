import React, { Component, useState } from "react"
import { useQuery } from "@apollo/react-hooks"
import { GET_USERS_QUERY } from "../../queries/queries"
// --------------------------------------------------------------

function AddNew() {
  const { loading, error, data } = useQuery(GET_USERS_QUERY)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div className="add-new">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3 className="add-new__heading">Exam details</h3>
          </div>
          <div className="col-md-12">
            <form action="#" method="post" className="add-new__form">
              <div className="row">
                <div className="col-md-6 add-new__left">
                  <label htmlFor="subject" className="add-new__form__label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="exam_subject"
                    placeholder="Math"
                    required
                    className="add-new__form__input input-required"
                  ></input>

                  <label htmlFor="exam-date" className="add-new__form__label">
                    Exam date
                  </label>
                  <input
                    type="date"
                    id="exam-date"
                    name="exam_date"
                    placeholder="DD/MM/YYYY"
                    required
                    className="add-new__form__input input-required"
                  ></input>

                  <label
                    htmlFor="study-start-date"
                    className="add-new__form__label"
                  >
                    Start learning on
                  </label>
                  <input
                    type="date"
                    id="study-start-date"
                    name="exam_study_start_date"
                    placeholder="DD/MM/YYYY"
                    className="add-new__form__input"
                  ></input>

                  <label htmlFor="page-amount" className="add-new__form__label">
                    Amount of pages
                  </label>
                  <input
                    type="number"
                    id="page-amount"
                    name="exam_page_amount"
                    placeholder="829"
                    required
                    className="add-new__form__input input-required"
                  ></input>

                  <label htmlFor="page-time" className="add-new__form__label">
                    Time per page
                  </label>
                  <input
                    type="time"
                    id="page-time"
                    name="exam_page_time"
                    placeholder="5 min"
                    className="add-new__form__input"
                  ></input>

                  <label htmlFor="page-repeat" className="add-new__form__label">
                    Repeat
                  </label>
                  <input
                    type="number"
                    id="page-repeat"
                    name="exam_page_repeat"
                    placeholder="2 times"
                    className="add-new__form__input"
                  ></input>

                  <label htmlFor="page-notes" className="add-new__form__label">
                    Notes
                  </label>
                  <textarea
                    id="page-notes"
                    name="exam_page_notes"
                    placeholder="..."
                    className="add-new__form__input"
                  ></textarea>
                </div>
                <div className="col-md-6 add-new__right">
                  <label htmlFor="pdf-upload" className="add-new__form__label">
                    Upload PDF file
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    id="pdf-upload"
                    name="exam_pdf_upload"
                    className="add-new__form__input"
                  ></input>

                  <input
                    type="submit"
                    value="Add"
                    className="add-new__form__btn stan-btn-primary"
                  ></input>
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
