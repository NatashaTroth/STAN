import React from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

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

// logo
import Logo from "./images/icons/logo.svg"

function Routing() {
  return (
    <Router>
      <div className="navigation">
        <div className="navigation__side-bar">
          <img
            src={Logo}
            alt="Stans Logo"
            className="navigation__side-bar__logo"
          />
          <ul className="navigation__side-bar__list">
            <div className="navigation__side-bar__list__menu-top">
              <li className="navigation__side-bar__list__menu-top__dashboard list-item">
                <Link to="/">Dashboard</Link>
              </li>
              <li className="navigation__side-bar__list__menu-top__add-new list-item">
                <Link to="/add-new">Add New</Link>
              </li>
              <li className="navigation__side-bar__list__menu-top__calendar list-item">
                <Link to="/calendar">Calendar</Link>
              </li>
              <li className="navigation__side-bar__list__menu-top__exams list-item">
                <Link to="/exams">Exams</Link>
              </li>
            </div>

            <div className="navigation__side-bar__list__menu-bottom">
              <li>
                <Link to="/profile">Profile Icon</Link>
              </li>
              <li>Dark mode</li>
              <li>
                <Link to="/imprint">Imprint</Link>
              </li>
              <li>
                <Link to="/data-policy">Data Policy</Link>
              </li>
            </div>
          </ul>
        </div>

        <Switch>
          <Route exact path="/">
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
      </div>
    </Router>
  )
}

export default Routing
