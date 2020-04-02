import React from "react"
// --------------------------------------------------------------

const Timeline = ({ heading, daysLeft, percentage, style }) => {
  // return ----------------
  return (
    <dl className={"timeline timeline-" + style}>
      <dt className="timeline__heading">{heading}</dt>
      <div className="timeline__bar">
        <dd
          className={"timeline__bar__percentage percentage-" + percentage}
        ></dd>
        <p className="timeline__bar__text">{daysLeft} left</p>
      </div>
    </dl>
  )
}

export default Timeline
