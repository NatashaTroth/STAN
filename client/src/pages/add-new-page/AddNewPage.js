import React from "react"
import { useQuery } from "@apollo/react-hooks"
import { CURRENT_USER } from "../../graphQL/queries"
import { getAccessToken } from "../../accessToken"
// --------------------------------------------------------------

// components ----------------
import AddNew from "../../components/add-new/AddNew"
import { Redirect } from "react-router"

function AddNewPage() {
  // query ----------------
  const { loading, error } = useQuery(CURRENT_USER)
  const token = getAccessToken()

  if (token.length === 0) {
    return <Redirect to="/" />
  }

  // error handling ----------------
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  // return ----------------
  return (
    <div className="add-new-page">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <h2 className="add-new-page__heading">New exam</h2>
            <p className="add-new-page__sub-heading">
              enter all details about the exam
            </p>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <AddNew></AddNew>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default AddNewPage
