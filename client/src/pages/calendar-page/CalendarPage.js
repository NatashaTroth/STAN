import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"

// TODO: https://fullcalendar.io/docs/react
class Calendar extends React.Component {
  render() {
    return (
      <div className="calendar">
        <div className="calendar__container container-fluid">
          <FullCalendar
            classname=""
            defaultView="dayGridMonth"
            plugins={[dayGridPlugin]}
            events={[
              { title: "Test Event", date: "2020-03-14" },
              { title: "Test Event", date: "2020-03-16" },
            ]}
          />
        </div>
      </div>
    )
  }
}

export default Calendar
