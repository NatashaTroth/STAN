import React, { useEffect, useState } from "react"
import { Redirect } from "react-router-dom"
import ReactDOM from "react-dom"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// query ----------------
import { useQuery } from "@apollo/react-hooks"
import { GET_CALENDAR_CHUNKS } from "../../graphQL/queries"

// helpers ----------------
import { formatDate, minuteToHours } from "../../helpers/dates"

// components ----------------
import QueryError from "../../components/error/Error"
import Loading from "../../components/loading/Loading"

// sub-components ----------------
import Button from "../../components/button/Button"

// libraries ----------------
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import listPlugin from "@fullcalendar/list"
import enLocale from "@fullcalendar/core/locales/en-gb"

// react-bootstrap ----------------
import Popover from "react-bootstrap/Popover"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"

const ExamsCalendar = () => {
  // query ----------------
  const { loading, error, data } = useQuery(GET_CALENDAR_CHUNKS)
  let chunks = []
  let exams = []

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />
  if (data && data.calendarChunks) {
    chunks = data.calendarChunks.calendarChunks
    exams = data.calendarChunks.calendarExams
  }

  return (
    <div className="exams-calendar">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="exams-calendar__inner col-lg-10">
            <FullCalendar
              id="calendar"
              className="calendar-table"
              height="auto"
              plugins={[dayGridPlugin, listPlugin]}
              defaultView="dayGridMonth"
              eventLimit={5}
              eventOverlap={false}
              navLinks={true}
              locale={enLocale}
              eventSources={[chunks, exams]}
              eventOrder={"duration"}
              columnHeaderFormat={{ weekday: "short" }}
              noEventsMessage="You've earned a break by now."
              views={{
                listWeek: {
                  buttonText: "week",
                },
              }}
              header={{
                left: "title",
                right: "dayGridMonth, listWeek, today, prev, next",
              }}
              eventRender={info => {
                const examDetails = info.event.extendedProps
                const examDate = examDetails.examDate
                const currentPage = examDetails.currentPage
                const numberPagesLeftTotal = examDetails.numberPagesLeftTotal
                const numberPagesPerDay = examDetails.numberPagesPerDay
                const durationTotal = examDetails.durationTotal
                const durationPerDay = examDetails.durationPerDay
                const pdfLink = examDetails.pdfLink

                const popover = (
                  <Popover id="popover-basic">
                    {examDetails.__typename === "CalendarChunkDetails" ? (
                      <Popover.Title as="h4" className="popover-title">
                        {info.event.title}

                        <Button
                          variant="button"
                          onClick={() => document.body.click()}
                          className="exam-details__headline--back-btn close-calendar-popup"
                        />
                      </Popover.Title>
                    ) : null}

                    {examDetails.__typename === "CalendarChunkDetails" ? (
                      <Popover.Content>
                        <div className="exam-date">
                          <h5>Exam date:</h5>
                          <p>{formatDate(examDate)}</p>
                        </div>
                        <div className="current-page">
                          <h5>Current page: </h5>
                          <p>{currentPage}</p>
                        </div>
                        <div className="total-pages-left">
                          <h5>Total pages left: </h5>
                          <p>{numberPagesLeftTotal}</p>
                        </div>
                        <div className="pages-per-day">
                          <h5>Pages per day to learn: ca. </h5>
                          <p>{numberPagesPerDay}</p>
                        </div>
                        <div className="duration-per-day">
                          <h5>Duration per day: ca. </h5>
                          <p>{minuteToHours(durationPerDay)}</p>
                        </div>
                        <div className="duration-total">
                          <h5>Duration total: </h5>
                          <p>{minuteToHours(durationTotal)}</p>
                        </div>
                        <div className="pdfLink">
                          <a href={pdfLink}>Link</a>
                        </div>
                      </Popover.Content>
                    ) : (
                      <Popover.Content>
                        {" "}
                        <h4>Exam deadline</h4>
                      </Popover.Content>
                    )}
                  </Popover>
                )

                const content = (
                  <OverlayTrigger
                    rootClose
                    placement="top"
                    overlay={popover}
                    trigger="click"
                  >
                    {info.view.type === "dayGridMonth" ? (
                      <div className="fc-content">
                        <span className="fc-content fc-title">
                          {info.event.title}
                        </span>
                      </div>
                    ) : (
                      <td>
                        <div className="fc-content">
                          <span className="fc-content fc-title">
                            {info.event.title}
                          </span>
                        </div>
                      </td>
                    )}
                  </OverlayTrigger>
                )
                ReactDOM.render(content, info.el)
              }}
            />
          </div>
          <div className="col-lg-1"></div>
        </div>
      </div>
    </div>
  )
}

export default ExamsCalendar
