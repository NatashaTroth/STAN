import React from "react"
import { Redirect } from "react-router"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// libraries ----------------
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import { OverlayTrigger } from "react-bootstrap"
import { Popover } from "react-bootstrap"

const localizer = momentLocalizer(moment)

const ExamsCalendar = () => {
  // redirects ----------------
  const currentUser = useCurrentUserValue()
  if (currentUser === undefined) {
    return <Redirect to="/login" />
  }

  const events = [
    {
      title: "All Day Event",
      description: "description for All Day Event",
      start: "2020-04-01",
      end: "2020-04-01",
    },
    // {
    //   title: "All Day Event",
    //   description: "description for All Day Event",
    //   start: "2020-04-01",
    // },
    // {
    //   title: "All Day Event",
    //   description: "description for All Day Event",
    //   start: "2020-04-01",
    // },
    // {
    //   title: "All Day Event",
    //   description: "description for All Day Event",
    //   start: "2020-04-01",
    // },
    // {
    //   title: "All Day Event",
    //   description: "description for All Day Event",
    //   start: "2020-04-01",
    // },
    // {
    //   title: "All Day Event",
    //   description: "description for All Day Event",
    //   start: "2020-04-01",
    // },
    // {
    //   title: "All Day Event",
    //   description: "description for All Day Event",
    //   start: "2020-04-01",
    // },
    {
      title: "Long Event",
      description: "description for Long Event",
      start: "2020-04-07",
      end: "2020-04-10",
    },
  ]

  const Event = ({ event }) => {
    let popoverClickRootClose = (
      <Popover id="popover-trigger-click-root-close" style={{ zIndex: 10000 }}>
        <strong>{event.description}</strong>
      </Popover>
    )

    return (
      <div>
        <div>
          <OverlayTrigger
            id="help"
            trigger="click"
            rootClose
            container={this}
            placement="top"
            overlay={popoverClickRootClose}
          >
            <div>{event.title}</div>
          </OverlayTrigger>
        </div>
      </div>
    )
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
              events={events}
              defaultDate={moment().toDate()}
              localizer={localizer}
              components={{
                event: Event,
              }}
              views={["month"]}
            />
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default ExamsCalendar
