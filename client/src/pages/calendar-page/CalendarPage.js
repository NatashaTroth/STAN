import React from "react"
import { Redirect } from "react-router"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// query ----------------
import { useQuery } from "@apollo/react-hooks"
import { GET_CALENDAR_CHUNKS } from "../../graphQL/queries"

// libraries ----------------
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { OverlayTrigger } from "react-bootstrap"
import { Popover } from "react-bootstrap"

moment.locale("en-gb", {
  week: {
    dow: 1,
    doy: 1,
  },
})

const localizer = momentLocalizer(moment)

const ExamsCalendar = () => {
  // query ----------------
  const { loading, error, data } = useQuery(GET_CALENDAR_CHUNKS)
  let exams = []

  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  if (loading) return <p className="loading">loading...</p>
  if (error) return <p>error...</p>
  if (data && data.calendarChunks) {
    exams = data.calendarChunks
  }

  console.log(exams)

  // const exams = [
  //   {
  //     subject: "Computer Networking",
  //     start: "2020-04-01",
  //     end: "2020-04-03",
  //     details: {
  //       examDate: "30/04/2020",
  //       currentPage: "7",
  //       numberPagesToday: "20",
  //       duration: "3 min.",
  //     },
  //     color: "#ef7a20",
  //   },
  // ]

  const Event = ({ event }) => {
    let popoverClick = (
      <Popover
        style={{
          zIndex: 100,
          padding: "18px",
          border: "1px solid black",
          borderRadius: "0",
        }}
      >
        <p className="popover-text">
          <strong>{event.subject}</strong>
        </p>
        <p className="popover-text">Deadline: {event.details.examDate}</p>
        <p className="popover-text">
          Page {event.details.currentPage} to{" "}
          {event.details.numberPagesLeftTotal}
        </p>
        <p className="popover-text">
          Duration per day: {event.details.durationPerDay} min.
        </p>
        <p className="popover-text">
          Duration total: {event.details.durationTotal} min.
        </p>
      </Popover>
    )

    return (
      <div className="overlay">
        <OverlayTrigger
          id="help"
          rootClose
          trigger="click"
          container={this}
          placement="top"
          overlay={popoverClick}
        >
          <div>{event.subject}</div>
        </OverlayTrigger>
      </div>
    )
  }

  // display full name of weekdays ----------------
  const weekDayFormats = {
    weekdayFormat: "dddd",
  }

  return (
    <div className="examsCalendar">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <Calendar
              startAccessor="start"
              endAccessor="end"
              style={{ height: 900 }}
              events={exams}
              defaultDate={moment().toDate()}
              localizer={localizer}
              formats={weekDayFormats}
              views={["month"]}
              components={{
                event: Event,
              }}
              eventPropGetter={event => ({
                style: {
                  backgroundColor: event.color,
                },
              })}
            />
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default ExamsCalendar
