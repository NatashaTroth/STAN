import React, { initialState, lazy } from "react"
import { Link } from "react-router-dom"
import useDarkMode from "use-dark-mode"
// --------------------------------------------------------------

// queries ----------------
import { CURRENT_USER } from "../../graphQL/users/queries"

// libraries ----------------
// import Particles from "react-particles-js"

// apolloClient cache ----------------
import { client } from "../../apolloClient"

// components ----------------
const SubHeading = lazy(() => import("../../components/sub-heading/SubHeading"))
const Listing = lazy(() => import("../../components/listing/Listing"))
const Dashboard = lazy(() => import("../dashboard-page/DashboardPage"))

const Home = () => {
  // dark mode specific ----------------
  // const darkMode = useDarkMode(initialState, {
  //   element: document.documentElement,
  // })
  // let particleColor
  // if (darkMode.value) {
  //   particleColor = "#ffffff"
  // } else {
  //   particleColor = "#000000"
  // }

  // redirects ----------------
  const currentUser = client.readQuery({ query: CURRENT_USER }).currentUser
  if (currentUser !== null) {
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

            <ul className="home__list">
              <Listing
                className="list-style"
                text="increase your learning motivation"
              />
              <Listing
                className="list-style"
                text="decrease your procrastination"
              />
            </ul>

            <div className="home__btn">
              <Link to="/sign-up" className="stan-btn-double">
                Start now
              </Link>
            </div>
          </div>
          <div className="col-md-1"></div>

          {/* <Particles
            params={{
              particles: {
                number: {
                  value: 160,
                  density: {
                    enable: false,
                  },
                },
                color: {
                  value: "#000000",
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
          /> */}
        </div>
      </div>
    </div>
  )
}

export default Home
