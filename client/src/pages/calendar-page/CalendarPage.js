import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
// --------------------------------------------------------------

// context
import { useCurrentUserValue } from "../../components/STAN/STAN"
import { Redirect } from "react-router"

// TODO: https://fullcalendar.io/docs/react
const Calendar = () => {
  const currentUser = useCurrentUserValue()

  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div className="calendar">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <FullCalendar
              className=""
              defaultView="dayGridMonth"
              plugins={[dayGridPlugin]}
              events={[
                { title: "Test Event", date: "2020-03-14" },
                { title: "Test Event", date: "2020-03-16" },
              ]}
            />
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
