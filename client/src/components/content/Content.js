import React from "react"
import { Switch, Route } from "react-router-dom"
import { CURRENT_USER } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"

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

const Content = () => {
  const { data, loading } = useQuery(CURRENT_USER)

  return (
    <main className="content">
      <Switch>
        {!loading && data && !data.currentUser ? (
          <Route path="/home" component={Home} />
        ) : null}
        {!loading && data && !data.currentUser ? (
          <Route path="/about" component={About} />
        ) : null}
        {!loading && data && !data.currentUser ? (
          <Route path="/login" component={Login} />
        ) : null}

        {!loading && data && data.currentUser ? (
          <Route exact={true} path="/" component={Dashboard} />
        ) : null}
        {!loading && data && data.currentUser ? (
          <Route path="/add-new" component={AddNew} />
        ) : null}
        {!loading && data && data.currentUser ? (
          <Route path="/calendar" component={Calendar} />
        ) : null}
        {!loading && data && data.currentUser ? (
          <Route path="/exams" component={Exams} />
        ) : null}
        {!loading && data && data.currentUser ? (
          <Route path="/profile" component={UserAccount} />
        ) : null}

        {(!loading && data && !data.currentUser) ||
        (!loading && data.currentUser) ? (
          <Route path="/imprint" component={Imprint} />
        ) : null}
        {(!loading && data && !data.currentUser) ||
        (!loading && data.currentUser) ? (
          <Route path="/data-policy" component={DataPolicy} />
        ) : null}
        {!loading && data && !data.currentUser ? (
          <Route path="/sign-up" component={SignUp} />
        ) : null}

        <Route path="*" component={NoMatch404} />
      </Switch>
    </main>
  )
}

export default Content
