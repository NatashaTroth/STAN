import React from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"

class Calendar extends React.Component {
  render() {
    return (
      <div className="calendar">
        <div className="calendar__container container-fluid">
          <FullCalendar defaultView="dayGridMonth" plugins={[dayGridPlugin]} />
        </div>
      </div>
    )
  }
}

export default Calendar
