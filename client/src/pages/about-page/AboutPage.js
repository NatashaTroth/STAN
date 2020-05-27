import React, { lazy } from "react"
import { Link, Redirect } from "react-router-dom"
// --------------------------------------------------------------

// queries ----------------
import { CURRENT_USER } from "../../graphQL/users/queries"

// images ----------------
import Pic1 from "../../images/desk1.png"
import Pic2 from "../../images/desk2.png"

// apolloClient cache ----------------
import { client } from "../../apolloClient"

// sub-components ----------------
const Image = lazy(() => import("../../components/image/Image"))
const SubHeading = lazy(() => import("../../components/sub-heading/SubHeading"))

const About = () => {
  // redirects ----------------
  const currentUser = client.readQuery({ query: CURRENT_USER }).currentUser
  if (currentUser !== null) {
    return <Redirect to="/" />
  }

  // return ----------------
  return (
    <div className="about">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-10">
            <h2 className="about__heading">Who is stan?</h2>
            <SubHeading className="sub-heading" text="We will explain" />
          </div>
          <div className="col-md-1"></div>

          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="container-fluid text-image-module">
              <div className="row">
                <div className="col-xl-6">
                  <div className="about__content">
                    <h3 className="list-style">your online study plan</h3>
                    <h4>Today's Goals</h4>
                    <p className="about__content__text">
                      The simple overview of today's study goals and their
                      approximate duration allows you to swiftly plan your
                      learning into the day.
                    </p>
                    <br />

                    <h4>Subject Overview</h4>
                    <p className="about__content__text">
                      For a more detailed view, all relevant information for
                      each learning chunk can be quickly accessed via the
                      dashboard. Click the done button when you have completed
                      your learning goal.
                    </p>
                    <br />
                    <h4>Today's Progress</h4>
                    <p className="about__content__text">
                      Stay motivated by visualising your current progress and
                      your succeeded goals of the day. The more you complete,
                      the happier your mascot will become.
                    </p>
                    <div className="about__content__btn">
                      <Link to="/sign-up" className="stan-btn-double">
                        Join stan
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-xl-6">
                  <Image
                    path={Pic1}
                    alt="Desk with devices and cup of coffee"
                    className="about__img"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>

          <div className="col-md-1"></div>
          <div className="col-md-10">
            <div className="container-fluid text-image-module text-image-module--reverse">
              <div className="row">
                <div className="col-xl-6">
                  <div className="about__content">
                    <h3 className="list-style">fight procrastination</h3>
                    <h4>Calendar</h4>
                    <p className="about__content__text">
                      Keep track of daily goals for the coming days, weeks, and
                      months. Give each exam a different color to quickly keep
                      an overview over each one. stan will warn you if you are
                      running out of time.
                    </p>
                    <br />
                    <h4>Email</h4>
                    <p className="about__content__text">
                      If you allow email notifications (can be changed at any
                      time), stan will inform you 3 days and again 1 day before
                      an exam. stan will also remind you on the day you planned
                      to start learning for an exam.
                    </p>
                    <br />
                    <h4>Your study buddy</h4>
                    <p className="about__content__text">
                      Your personal mascot stan is your constant study
                      companion, ready to cheer you on through each exam. Stan's
                      current mood and motivational speeches reflect your
                      current progress, to keep your motivation flowing.
                    </p>
                    <br />
                    <h4>Dark Mode</h4>
                    <p className="about__content__text">
                      And most important of all, the dark mode. Learn inside,
                      outside, during the day, or late at night. stan will
                      adjust its colour theme to match your preferences. It also
                      automatically adjusts to your computer’s settings (e.g. if
                      Mac dark mode is on, stan’s will be too).
                    </p>
                  </div>
                </div>

                <div className="col-xl-6">
                  <Image
                    path={Pic2}
                    alt="Desk with devices and cup of coffee"
                    className="about__img"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>
      </div>
    </div>
  )
}

export default About
