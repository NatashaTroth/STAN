import React from "react"
import { Switch, Route } from "react-router-dom"

// pages component
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

// authentication component
import WithAuth from "../with-auth/WithAuth"

const content = () => {
  return (
    <main className="content">
      <Switch>
        <Route exact={true} path="/" component={WithAuth(Dashboard)} />
        <Route path="/add-new" component={WithAuth(AddNew)} />
        <Route path="/calendar" component={WithAuth(Calendar)} />
        <Route path="/exams" component={WithAuth(Exams)} />
        <Route path="/profile" component={WithAuth(UserAccount)} />
        <Route path="/home" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/login" component={Login} />
        <Route path="/imprint" component={Imprint} />
        <Route path="/data-policy" component={DataPolicy} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="*" component={NoMatch404} />
      </Switch>
    </main>
  )
}

export default content
