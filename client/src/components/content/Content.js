import React from "react"
import { Switch, Route } from "react-router-dom"
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

const Content = () => {
  // return ----------------
  return (
    <main className="content">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/sign-up" component={SignUp} />
        <Route exact path="/popup" component={LoginPopUp} />

        <Route exact path="/add-new" component={AddNew} />
        <Route exact path="/calendar" component={Calendar} />
        <Route exact path="/exams" component={Exams} />
        <Route exact path="/profile" component={UserAccount} />

        <Route exact path="/imprint" component={Imprint} />
        <Route exact path="/data-policy" component={DataPolicy} />

        <Route path="*" component={NoMatch404} />
      </Switch>
    </main>
  )
}

export default Content
