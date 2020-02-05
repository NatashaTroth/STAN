import React from "react"
import { Switch, Route } from "react-router-dom"

// pages
import Dashboard from "./pages/dashboard-page/DashboardPage"
import AddNew from "./pages/add-new-page/AddNewPage"
import Calendar from "./pages/calendar-page/CalendarPage"
import Exams from "./pages/exams-page/ExamsPage"
import NoMatch404 from "./pages/no-match-page/404Page"
import UserAccount from "./pages/user-account-page/UserAccountPage"
import Imprint from "./pages/imprint-page/ImprintPage"
import DataPolicy from "./pages/data-policy-page/DataPolicyPage"
import Login from "./pages/login-page/LoginPage"
import SignUp from "./pages/sign-up-page/SignUpPage"

function Routing() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Dashboard />
      </Route>
      <Route path="/add-new">
        <AddNew />
      </Route>
      <Route path="/calendar">
        <Calendar />
      </Route>
      <Route path="/exams">
        <Exams />
      </Route>
      <Route path="/profile">
        <UserAccount />
      </Route>
      <Route path="/imprint">
        <Imprint />
      </Route>
      <Route path="/data-policy">
        <DataPolicy />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/sign-up">
        <SignUp />
      </Route>
      <Route path="*">
        <NoMatch404 />
      </Route>
    </Switch>
  )
}

export default Routing
