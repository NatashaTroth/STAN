import React from "react"
import { Redirect } from "react-router"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// libraries ----------------
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import { Tooltip } from "reactstrap"

// TODO: https://fullcalendar.io/docs/react
const ExamsCalendar = () => {
  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  // color: '#ff00ac'
  /*
  eventRender: function (event, element, view) {
   if (event.color) {
       element.css('background-color', event.color)
   }
}
  */
  const events = [
    {
      title: "All Day Event",
      description: "description for All Day Event",
      start: "2020-04-01",
    },
    {
      title: "All Day Event",
      description: "description for All Day Event",
      start: "2020-04-01",
    },
    {
      title: "All Day Event",
      description: "description for All Day Event",
      start: "2020-04-01",
    },
    {
      title: "All Day Event",
      description: "description for All Day Event",
      start: "2020-04-01",
    },
    {
      title: "All Day Event",
      description: "description for All Day Event",
      start: "2020-04-01",
    },
    {
      title: "All Day Event",
      description: "description for All Day Event",
      start: "2020-04-01",
    },
    {
      title: "All Day Event",
      description: "description for All Day Event",
      start: "2020-04-01",
    },
    {
      title: "Long Event",
      description: "description for Long Event",
      start: "2020-04-07",
      end: "2020-04-10",
    },
  ]

  const eventRender = info => {
    let tooltip = new Tooltip(info.el, {
      title: info.event.extendedProps.description,
      placement: "top",
      trigger: "hover",
      container: "body",
      target: "",
    })
  }

  return (
    <div className="examsCalendar">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <FullCalendar
              defaultDate={new Date()}
              defaultView="dayGridMonth"
              plugins={[dayGridPlugin]}
              events={events}
              eventLimit={true}
              eventRender={eventRender}
            />
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default ExamsCalendar
