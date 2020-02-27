import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { GET_USERS_QUERY } from "../../graphQL/queries"
// --------------------------------------------------------------

function EmptyDashboard() {
  // query ----------------
  const { loading, error } = useQuery(GET_USERS_QUERY)

  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  // return ----------------
  return (
    <div className="empty-dashboard box-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <h3 className="empty-dashboard__heading">No open tasks</h3>
            <p className="empty-dashboard__text">
              Are you sure there are no exams you need to study for?
            </p>
            <a
              href="/add-new"
              className="empty-dashboard__btn stan-btn-primary"
            >
              {" "}
              Add exam
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyDashboard
