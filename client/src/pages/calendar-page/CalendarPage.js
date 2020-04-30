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
        color: "#A48C24",
        extendedProps: {
          examDate: "2020-04-29",
          currentPage: 450,
          numberPagesLeftTotal: 1209,
          numberPagesPerDay: 68,
          durationTotal: 12090,
          durationPerDay: 680,
        },
      },
      // {
      //   title: "English",
      //   start: "2020-04-29T00:00:00.000Z",
      //   end: "2020-05-04T00:00:00.000Z",
      //   color: "#A48C24",
      //   extendedProps: {
      //     examDate: "2020-04-29T00:00:00.000Z",
      //     currentPage: 450,
      //     numberPagesLeftTotal: 1209,
      //     numberPagesPerDay: 68,
      //     durationTotal: 12090,
      //     durationPerDay: 680,
      //   },
      // },
      // {
      //   title: "English",
      //   start: "2020-04-29T00:00:00.000Z",
      //   end: "2020-05-04T00:00:00.000Z",
      //   color: "#A48C24",
      //   extendedProps: {
      //     examDate: "2020-04-29T00:00:00.000Z",
      //     currentPage: 450,
      //     numberPagesLeftTotal: 1209,
      //     numberPagesPerDay: 68,
      //     durationTotal: 12090,
      //     durationPerDay: 680,
      //   },
      // },
      // {
      //   title: "English",
      //   start: "2020-04-29T00:00:00.000Z",
      //   end: "2020-05-04T00:00:00.000Z",
      //   color: "#A48C24",
      //   extendedProps: {
      //     examDate: "2020-04-29T00:00:00.000Z",
      //     currentPage: 450,
      //     numberPagesLeftTotal: 1209,
      //     numberPagesPerDay: 68,
      //     durationTotal: 12090,
      //     durationPerDay: 680,
      //   },
      // },
      // {
      //   title: "English",
      //   start: "2020-04-29T00:00:00.000Z",
      //   end: "2020-05-04T00:00:00.000Z",
      //   color: "#A48C24",
      //   extendedProps: {
      //     examDate: "2020-04-29T00:00:00.000Z",
      //     currentPage: 450,
      //     numberPagesLeftTotal: 1209,
      //     numberPagesPerDay: 68,
      //     durationTotal: 12090,
      //     durationPerDay: 680,
      //   },
      // },
      {
        title: "Mathe",
        start: "2020-04-01T00:00:00.000Z",
        end: "2020-05-04T00:00:00.000Z",
        color: "#A48C24",
        extendedProps: {
          examDate: "2020-05-15T00:00:00.000Z",
          currentPage: 999,
          numberPagesLeftTotal: 99,
          numberPagesPerDay: 9,
          durationTotal: 9,
          durationPerDay: 9,
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
      {
        title: "German",
        start: "2020-05-12T00:00:00.000Z",
        end: "2020-05-12T00:00:00.000Z",
        color: "pink",
      },
      {
        title: "German",
        start: "2020-05-12T00:00:00.000Z",
        end: "2020-05-12T00:00:00.000Z",
        color: "purple",
      },
      {
        title: "German",
        start: "2020-05-12T00:00:00.000Z",
        end: "2020-05-12T00:00:00.000Z",
        color: "green",
      },
      {
        title: "German",
        start: "2020-05-12T00:00:00.000Z",
        end: "2020-05-12T00:00:00.000Z",
        color: "yellow",
      },
    ]
  }

  return (
    <div className="exams-calendar">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <FullCalendar
              height="auto"
              plugins={[dayGridPlugin, listPlugin]}
              defaultView="dayGridMonth"
              eventLimit={5}
              navLinks={true}
              locale={enLocale}
              events={exams}
              columnHeaderFormat={{ weekday: "long" }}
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
                        <div className="current-ap">
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
                      </Popover.Content>
                    ) : (
                      <Popover.Content>
                        {" "}
                        <h4>Exam deadline</h4>
                      </Popover.Content>
                    )}
                  </Popover>
                )

                let evtId = "event-" + info.event.id
                const content = (
                  <OverlayTrigger
                    rootClose
                    placement="top"
                    overlay={popover}
                    trigger="click"
                  >
                    {info.view.type === "dayGridMonth" ? (
                      <div className="fc-content" id={evtId}>
                        <span className="fc-content fc-title">
                          {info.event.title}
                        </span>
                      </div>
                    ) : (
                      <td>
                        <div className="fc-content" id={evtId}>
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
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default ExamsCalendar
