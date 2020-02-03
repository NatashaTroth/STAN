import React from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

// pages
import Dashboard from "./pages/dashboard-page"
import AddNew from "./pages/add-new-page"
import Calendar from "./pages/calendar-page"
import Exams from "./pages/exams-page"
import NoMatch404 from "./pages/no-match-page"

function Routing() {
  return (
    <Router>
      <div className="navigation">
        <ul className="navigation__list">
          <li>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <Link to="/add-new">Add New</Link>
          </li>
          <li>
            <Link to="/calendar">Calendar</Link>
          </li>
          <li>
            <Link to="/exams">Exams</Link>
          </li>
        </ul>

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
          <Route path="*">
            <NoMatch404 />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default Routing
