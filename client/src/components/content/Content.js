import React from "react"
import { useCurrentUserValue } from "../STAN/STAN"
import { Switch, Route, Redirect } from "react-router-dom"
// --------------------------------------------------------------

// pages component ----------------
import Dashboard from "../../pages/dashboard-page/DashboardPage"
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
import Mascots from "../../components/mascots/Mascots"

const Content = () => {
  // context api ----------------
  let currentUser = useCurrentUserValue()
  let isAuth = false

  if (currentUser === undefined) isAuth = false
  else if (currentUser.id != null) isAuth = true
  else isAuth = false

  // signup trigger
  let setMascot = window.localStorage.getItem("setMascot") === "true"

  // return ----------------
  return (
    <main className="content">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/sign-up" component={SignUp} />
        <Route exact path="/mascots" component={Mascots} />
        <Route exact path="/popup" component={LoginPopUp} />

        {/* <Route exact path="/" component={Dashboard} /> */}
        <Route exact path="/add-new" component={AddNew} />
        <Route exact path="/calendar" component={Calendar} />
        <Route exact path="/exams" component={Exams} />
        <Route exact path="/profile" component={UserAccount} />

        <Route exact path="/imprint" component={Imprint} />
        <Route exact path="/data-policy" component={DataPolicy} />

        <Route path="*" component={NoMatch404} />

        {/* {!isAuth ? <Route exact path="/" component={Home} /> : null}
        {!isAuth ? (
          <Route exact path="/about" component={About} />
        ) : (
          <Redirect from="/about" to="/" />
        )}

        {isAuth ? <Route exact={true} path="/" component={Dashboard} /> : null}

        {!isAuth ? (
          <Route exact path="/login" component={Login} />
        ) : (
          <Redirect from="/login" to="/" />
        )}
        {!isAuth ? (
          <Route exact path="/sign-up" component={SignUp} />
        ) : (
          <Redirect from="/sign-up" to="/" />
        )}

        {isAuth ? (
          <Route exact path="/add-new" component={AddNew} />
        ) : (
          <Redirect from="/add-new" to="/login" />
        )}
        {isAuth ? (
          <Route exact path="/calendar" component={Calendar} />
        ) : (
          <Redirect from="/calendar" to="/login" />
        )}
        {isAuth ? (
          <Route exact path="/exams" component={Exams} />
        ) : (
          <Redirect exact from="/exams" to="/login" />
        )}
        {isAuth ? (
          <Route exact path="/profile" component={UserAccount} />
        ) : (
          <Redirect from="/profile" to="/login" />
        )}

        {!isAuth ? <Route exact path="/popup" component={LoginPopUp} /> : null}
        {isAuth && setMascot ? (
          <Route exact path="/mascots" component={Mascots} />
        ) : null}

        <Route exact path="/imprint" component={Imprint} />
        <Route exact path="/data-policy" component={DataPolicy} />

        <Route path="*" component={NoMatch404} /> */}
      </Switch>
    </main>
  )
}

export default Content
