import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom"

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
          <a href="/dashboard">
            <img
              src={Logo}
              alt="Stans Logo"
              className="navigation__side-bar__logo"
            />
          </a>
          <ul className="navigation__side-bar__list">
            <div className="navigation__side-bar__list__menu-top">
              <li className="navigation__side-bar__list__menu-top__dashboard list-item">
                <NavLink to="/dashboard" activeClassName="chosen">
                  Dashboard
                </NavLink>
              </li>
              <li className="navigation__side-bar__list__menu-top__add-new list-item">
                <NavLink to="/add-new" activeClassName="chosen">
                  Add New
                </NavLink>
              </li>
              <li className="navigation__side-bar__list__menu-top__calendar list-item">
                <NavLink to="/calendar" activeClassName="chosen">
                  Calendar
                </NavLink>
              </li>
              <li className="navigation__side-bar__list__menu-top__exams list-item">
                <NavLink to="/exams" activeClassName="chosen">
                  Exams
                </NavLink>
              </li>
            </div>

            <div className="navigation__side-bar__list__menu-bottom">
              <li>
                <NavLink to="/profile" activeClassName="chosen">
                  Profile Icon
                </NavLink>
              </li>
              <li>Dark mode</li>
              <li>
                <NavLink to="/imprint" activeClassName="chosen">
                  Imprint
                </NavLink>
              </li>
              <li>
                <NavLink to="/data-policy" activeClassName="chosen">
                  Data Policy
                </NavLink>
              </li>
            </div>
          </ul>
        </div>

        <Switch>
          {/* <Route path="/">
            <Dashboard />
          </Route> */}
          <Route path="/dashboard">
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
