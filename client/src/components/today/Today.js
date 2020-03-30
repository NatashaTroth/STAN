import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { GET_USERS_QUERY } from "../../graphQL/queries"
// --------------------------------------------------------------

// components ----------------
import TodaySubject from "../../components/today-subject/TodaySubject"

function Today() {
  // query ----------------
  const { loading, error } = useQuery(GET_USERS_QUERY)

  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  // return ----------------
  return (
    <div className="today box-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="today__container">
              <div className="today__container__header">
                <h3 className="today__container__header__heading">Today</h3>
                <div className="today__container__header__deadline">
                  <p className="today__container__header__deadline__text">
                    deadline
                  </p>
                  {/* TODO: insert deadline */}
                  <p className="today__container__header__deadline__date">
                    30/01/20
                  </p>
                </div>
              </div>
              <div className="today__container__content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Today
