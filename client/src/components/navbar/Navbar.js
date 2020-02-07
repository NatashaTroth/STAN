import React from "react"
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Switch,
  Link,
} from "react-router-dom"

// TABLET: width 70%:
// Mobile: volle Breite mit X im Screen

// logo
import Logo from "../../images/icons/logo.svg"

// components
// import Dashboard from "../../pages/dashboard-page/DashboardPage"
// import AddNew from "../../pages/add-new-page/AddNewPage"
// import Calendar from "../../pages/calendar-page/CalendarPage"
// import Exams from "../../pages/exams-page/ExamsPage"
// import NoMatch404 from "../../pages/no-match-page/404Page"
// import UserAccount from "../../pages/user-account-page/UserAccountPage"
// import Imprint from "../../pages/imprint-page/ImprintPage"
// import DataPolicy from "../../pages/data-policy-page/DataPolicyPage"
// import Login from "../../pages/login-page/LoginPage"
// import SignUp from "../../pages/sign-up-page/SignUpPage"

import NavDirection from "../../components/nav-link/Navlink"
import RouteContent from "../../components/route-content/RouteContent"

const navbar = props => {
  return (
    <div className="side-bar">
      <Router>
        <NavDirection />
        <RouteContent />
        {/* <nav className={barClasses}>
          <div className="side-bar__items__logo">
            <a href="/">
              <img
                src={Logo}
                alt="Stans Logo"
                className="side-bar__items__logo--img"
              />
            </a>
          </div>
          <ul className="side-bar__items__list">
            <div className="side-bar__items__list__menu-top">
              <li className="side-bar__items__list__menu-top__dashboard list-item">
                <NavLink strict to="/" exact activeClassName="active">
                  Dashboard
                </NavLink>
              </li>
              <li className="side-bar__items__list__menu-top__add-new list-item">
                <NavLink strict to="/add-new" exact activeClassName="active">
                  Add New
                </NavLink>
              </li>
              <li className="side-bar__items__list__menu-top__calendar list-item">
                <NavLink strict to="/calendar" exact activeClassName="active">
                  Calendar
                </NavLink>
              </li>
              <li className="side-bar__items__list__menu-top__exams list-item">
                <NavLink strict to="/exams" exact activeClassName="active">
                  Exams
                </NavLink>
              </li>
            </div>

            <div className="side-bar__items__list__menu-bottom">
              <li>
                <NavLink strict to="/profile" exact activeClassName="active">
                  Profile Icon
                </NavLink>
              </li>
              <li>Dark mode</li>
              <li>
                <NavLink strict to="/imprint" exact activeClassName="active">
                  Imprint
                </NavLink>
              </li>
              <li>
                <NavLink
                  strict
                  to="/data-policy"
                  exact
                  activeClassName="active"
                >
                  Data Policy
                </NavLink>
              </li>
            </div>
          </ul>
        </nav>

        <div className="side-bar__content">
          <Switch>
            <Route exact={true} path="/" component={Dashboard} />
            <Route path="/add-new" component={AddNew} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/exams" component={Exams} />
            <Route path="/profile" component={UserAccount} />
            <Route path="/imprint" component={Imprint} />
            <Route path="/data-policy" component={DataPolicy} />
            <Route path="/login" component={Login} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="*" component={NoMatch404} />
          </Switch>
        </div> */}
      </Router>
    </div>
  )
}

export default navbar
