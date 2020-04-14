import React from "react"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// components ----------------
import SubHeading from "../../components/sub-heading/SubHeading"
import Listing from "../../components/listing/Listing"
import Dashboard from "../dashboard-page/DashboardPage"

function Home() {
  // redirects ----------------
  let currentUser = useCurrentUserValue()
  if (currentUser !== undefined) {
    return <Dashboard />
  }

  // return ----------------
  return (
    <div className="home">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <h2 className="home__heading">
              Organize your <br></br>Study Plan
            </h2>
            <SubHeading className="sub-heading" text="Easy . Fast . Online" />

            <p className="home__text">
              Students like you can add and organize their learning material for
              exams with Stan! Stan supports you in dividing up your tasks for
              each subject. Deadlines, as well as calculated learning chunks,
              are visualized so you can keep track of your progress and counter
              procrastination.
            </p>

            <div className="home__list">
              <Listing
                className="list-style"
                text="increase your learning motivation"
              />
              <Listing
                className="list-style"
                text="decrease your procrastination"
              />
            </div>

            <div className="home__btn">
              <a href="/sign-up" className="stan-btn-double">
                Start now
              </a>
            </div>
            <div className="col-md-1"></div>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default Home
