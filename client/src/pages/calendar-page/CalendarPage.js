import React from "react"
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
  let exams = []

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />
  if (data && data.calendarChunks) {
    // exams = data.calendarChunks
    // TODO: implement exam in calendar
    exams = [
      {
        title: "English",
        start: "2020-04-29",
        end: "2020-05-04",
        color: "dark-grey",
        extendedProps: {
          examDate: "2020-04-29",
          currentPage: 450,
          numberPagesLeftTotal: 1209,
          numberPagesPerDay: 68,
          durationTotal: 12090,
          durationPerDay: 680,
          pdfLink: "TODO: ADD PDF LINK",
        },
      },
      {
        title: "German",
        start: "2020-05-12T00:00:00.000Z",
        end: "2020-05-12T00:00:00.000Z",
        color: "red",
      },
      {
        title: "German",
        start: "2020-05-12T00:00:00.000Z",
        end: "2020-05-12T00:00:00.000Z",
        color: "blue",
      },
    ]
  }

  return (
    <div className="exams-calendar">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-lg-10">
            <FullCalendar
              className="calendar-table"
              height="auto"
              plugins={[dayGridPlugin, listPlugin]}
              defaultView="dayGridMonth"
              eventLimit={4}
              navLinks={true}
              locale={enLocale}
              events={exams}
              eventOrder={"end"}
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
                    {Object.keys(examDetails).length !== 0 ? (
                      <Popover.Title as="h4">{info.event.title}</Popover.Title>
                    ) : null}

                    {Object.keys(examDetails).length !== 0 ? (
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
