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
  let isAuth

  if (!loading && data && data.currentUser) isAuth = true
  else isAuth = false

  return (
    <main className="content">
      <Switch>
        {!isAuth ? <Route exact path="/" component={Home} /> : null}
        {isAuth ? <Route exact={true} path="/" component={Dashboard} /> : null}

        {!isAuth ? (
          <Route exact path="/about" component={About} />
        ) : (
          <Redirect from="/about" to="/" />
        )}

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
          <Redirect from="/add-new" to="/" />
        )}
        {isAuth ? (
          <Route exact path="/calendar" component={Calendar} />
        ) : (
          <Redirect from="/calendar" to="/" />
        )}
        {isAuth ? (
          <Route exact path="/exams" component={Exams} />
        ) : (
          <Redirect exact from="/exams" to="/" />
        )}
        {isAuth ? (
          <Route exact path="/profile" component={UserAccount} />
        ) : (
          <Redirect from="/profile" to="/" />
        )}

        <Route exact path="/imprint" component={Imprint} />
        <Route exact path="/data-policy" component={DataPolicy} />

        <Route path="*" component={NoMatch404} />
      </Switch>
    </main>
  )
}

export default Content
