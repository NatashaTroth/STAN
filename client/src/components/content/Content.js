import React from "react"
import { Switch, Route, Redirect } from "react-router-dom"
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

  console.log("content")
  if (data && data.currentUser) {
    console.log(data.currentUser)
    console.log(loading)
  }

  return (
    <main className="content">
      <Switch>
        {!loading && data && !data.currentUser ? (
          <Route path="/home" component={Home} />
        ) : (
          <Redirect from="/home" to="/" />
        )}

        {!loading && data && !data.currentUser ? (
          <Route path="/about" component={About} />
        ) : (
          <Redirect from="/about" to="/" />
        )}
        {!loading && data && !data.currentUser ? (
          <Route path="/login" component={Login} />
        ) : (
          <Redirect from="/login" to="/" />
        )}
        {!loading && data && !data.currentUser ? (
          <Route path="/sign-up" component={SignUp} />
        ) : (
          <Redirect from="/sign-up" to="/home" />
        )}

        {!loading && data && data.currentUser ? (
          <Route exact={true} path="/" component={Dashboard} />
        ) : null}
        {!loading && data && data.currentUser ? (
          <Route path="/add-new" component={AddNew} />
        ) : (
          <Redirect from="/add-new" to="/home" />
        )}
        {!loading && data && data.currentUser ? (
          <Route path="/calendar" component={Calendar} />
        ) : (
          <Redirect from="/calendar" to="/home" />
        )}
        {!loading && data && data.currentUser ? (
          <Route path="/exams" component={Exams} />
        ) : (
          <Redirect from="/exams" to="/home" />
        )}
        {!loading && data && data.currentUser ? (
          <Route path="/profile" component={UserAccount} />
        ) : (
          <Redirect from="/profile" to="/home" />
        )}

        <Route path="/imprint" component={Imprint} />
        <Route path="/data-policy" component={DataPolicy} />

        {/* <Route path="*" component={NoMatch404} /> */}
      </Switch>
    </main>
  )
}

export default Content
