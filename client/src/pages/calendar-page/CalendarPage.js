import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import { getAccessToken } from "../../accessToken"
// --------------------------------------------------------------

// TODO: https://fullcalendar.io/docs/react
class Calendar extends React.Component {
  render() {
    // return ----------------
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
}

export default Calendar
