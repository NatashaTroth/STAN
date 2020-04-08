import React from "react"
import { Switch, Route, withRouter } from "react-router-dom"
// --------------------------------------------------------------

// pages component ----------------
import AddNew from "../../pages/add-new-page/AddNewPage"
import Calendar from "../../pages/calendar-page/CalendarPage"
import Exams from "../../pages/exams-page/ExamsPage"
import NoMatch404 from "../../pages/no-match-page/404Page"
import UserAccount from "../../pages/user-account-page/UserAccountPage"
import Imprint from "../../pages/imprint-page/ImprintPage"
import DataPolicy from "../../pages/data-policy-page/DataPolicyPage"
import Login from "../../pages/login-page/LoginPage"
import SignUp from "../../pages/sign-up-page/SignUpPage"
import Home from "../../pages/home-page/HomePage"
import About from "../../pages/about-page/AboutPage"
import LoginPopUp from "../../components/login-popup/LoginPopUp"
import ExamsDetails from "../../components/current-exam/ExamDetails"
// import ExamsDetailsEdit from "../../components/current-exam/ExamDetailsEdit"

// transition ----------------
import { TransitionGroup, CSSTransition } from "react-transition-group"

const Content = ({ location }) => {
  // return ----------------
  return (
    <main className="content">
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          timeout={{ enter: 300, exit: 300 }}
          classNames={"fade"}
        >
          <Switch location={location}>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/sign-up" component={SignUp} />
            <Route exact path="/popup" component={LoginPopUp} />

            <Route exact path="/add-new" component={AddNew} />
            <Route exact path="/calendar" component={Calendar} />
            <Route exact path="/exams" component={Exams} />
            <Route
              exact
              path="/exams/:subject"
              render={props => <ExamsDetails {...props} />}
            />
            <Route exact path="/profile" component={UserAccount} />

            <Route exact path="/imprint" component={Imprint} />
            <Route exact path="/data-policy" component={DataPolicy} />

            <Route path="*" component={NoMatch404} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </main>
  )
}

export default withRouter(Content)
