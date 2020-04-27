import React from "react"
import { Redirect } from "react-router"
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
import Button from "../../components/button/Button"

// libraries ----------------
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { Popover, OverlayTrigger } from "react-bootstrap"

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

  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />
  if (data && data.calendarChunks) {
    exams = data.calendarChunks
  }

  const Event = ({ event }) => {
    let popoverClick = (
      <Popover
        style={{
          zIndex: 100,
          padding: "18px",
          border: "2px solid black",
          borderRadius: "0",
          width: "300px",
        }}
      >
        <Popover.Title as="h4">{event.subject}</Popover.Title>
        <Popover.Content>
          <strong>
            Exam date:{" "}
            <span className="exam-date">
              {" "}
              {formatDate(event.details.examDate)}
            </span>
          </strong>
          <br></br>
          <strong>Current page: </strong>
          {event.details.currentPage}
          <br></br>
          <strong>Total pages left: </strong>{" "}
          {event.details.numberPagesLeftTotal}
          <br></br>
          <strong>Pages per day to learn: </strong> ca.{" "}
          {event.details.numberPagesPerDay}
          <br></br>
          <strong>Duration per day:</strong> ca.{" "}
          {minuteToHours(event.details.durationPerDay)}
          <br></br>
          <strong>Duration total:</strong>{" "}
          {minuteToHours(event.details.durationTotal)}
        </Popover.Content>
      </Popover>
    )

    return (
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
    )
  }

  // display full name of weekdays ----------------
  const weekDayFormats = {
    weekdayFormat: "dddd",
  }

  return (
    <div className="exams-calendar">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <Calendar
              popup
              startAccessor="start"
              endAccessor="end"
              style={{ height: 900 }}
              events={exams}
              defaultDate={moment().toDate()}
              localizer={localizer}
              formats={weekDayFormats}
              defaultView={"month"}
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
