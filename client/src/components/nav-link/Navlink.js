import React from "react"
import { Link, NavLink } from "react-router-dom"

// logo
import Logo from "../../images/icons/logo.svg"

const navLink = props => {
  let barClasses = "side-bar__items"

  if (props.show) {
    barClasses = "side-bar__items open"
  }

  return (
    <nav className={barClasses}>
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
            <NavLink strict to="/data-policy" exact activeClassName="active">
              Data Policy
            </NavLink>
          </li>
        </div>
      </ul>
    </nav>
  )
}

export default navLink
