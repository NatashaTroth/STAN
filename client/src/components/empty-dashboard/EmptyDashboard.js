import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { Link } from "react-router-dom"
// --------------------------------------------------------------

const EmptyDashboard = ({ heading, text, showBtn }) => {
  let btnAddExam

  if (showBtn == "yes") {
    btnAddExam = (
      <Link
        to="/add-new"
        href="/add-new"
        className="empty-dashboard__btn stan-btn-primary"
      >
        Add exam
      </Link>
    )
  }
  // return ----------------
  return (
    <div className="empty-dashboard box-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3 className="empty-dashboard__heading">{heading}</h3>
            <p className="empty-dashboard__text">{text}</p>
            {btnAddExam}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyDashboard
