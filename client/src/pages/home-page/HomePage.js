import React from "react"
import { Link } from "react-router-dom"
// --------------------------------------------------------------

// context ----------------
import { useCurrentUserValue } from "../../components/STAN/STAN"

// components ----------------
import SubHeading from "../../components/sub-heading/SubHeading"
import Listing from "../../components/listing/Listing"
import Dashboard from "../dashboard-page/DashboardPage"

// libraries ----------------
import Particles from "react-particles-js"

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
              <Link to="/sign-up" className="stan-btn-double">
                Start now
              </Link>
            </div>
            <div className="col-md-1"></div>
          </div>
          <div className="col-md-1"></div>

          {/* TODO: particles examples: https://rpj.bembi.org/ */}
          <Particles
            params={{
              particles: {
                number: {
                  value: 160,
                  density: {
                    enable: false,
                  },
                },
                color: {
                  value: "#979797",
                },
                size: {
                  value: 3,
                  random: true,
                  anim: {
                    speed: 4,
                    size_min: 0.3,
                  },
                },
                line_linked: {
                  enable: false,
                },
                move: {
                  random: true,
                  speed: 1,
                  direction: "top",
                  out_mode: "out",
                },
              },
              interactivity: {
                events: {
                  onhover: {
                    enable: true,
                    mode: "bubble",
                  },
                  onclick: {
                    enable: true,
                    mode: "repulse",
                  },
                },
                modes: {
                  bubble: {
                    distance: 250,
                    duration: 2,
                    size: 0,
                    opacity: 0,
                  },
                  repulse: {
                    distance: 400,
                    duration: 4,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
