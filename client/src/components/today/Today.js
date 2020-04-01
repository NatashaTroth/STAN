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
                    30/01/2020
                  </p>
                </div>
              </div>
              <div className="today__container__content">
                <div className="today__container__content__layout">
                  <div className="today__container__content__subject">
                    <p className="today__container__content__label">Subject</p>
                    <p className="today__container__content__text--big">
                      Computer Networks
                    </p>
                  </div>
                  <div className="today__container__content__warning">
                    <p className="today__container__content__text--warning">
                      Info: You need to study faster to finish all pages until
                      the exam!
                    </p>
                  </div>
                </div>
                <div className="today__container__content__layout">
                  <div className="today__container__content__details">
                    <div className="today__container__content__details__goal">
                      <p className="today__container__content__label">Goal:</p>
                      <p className="today__container__content__text">
                        page 280 to 340
                      </p>
                    </div>
                    <div className="today__container__content__details__duration">
                      <p className="today__container__content__label">
                        Duration:
                      </p>
                      <p className="today__container__content__text">20 min</p>
                    </div>
                  </div>

                  <div className="today__container__content__total-pages">
                    <p className="today__container__content__label">
                      Total pages
                    </p>
                    <p className="today__container__content__text">280 / 890</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Today
