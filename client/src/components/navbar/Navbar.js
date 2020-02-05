import React from "react"
import { NavLink } from "react-router-dom"

function Navbar() {
  return (
    // <nav className="navigation__side-bar">
    //   <a href="/">
    //     <img
    //       src={Logo}
    //       alt="Stans Logo"
    //       className="navigation__side-bar__logo"
    //     />
    //   </a>
    //   <ul className="navigation__side-bar__list">
    //     <div className="navigation__side-bar__list__menu-top">
    //       <li className="navigation__side-bar__list__menu-top__dashboard list-item">
    //         <NavLink strict to="/" exact activeClassName="active">
    //           Dashboard
    //         </NavLink>
    //       </li>
    //       <li className="navigation__side-bar__list__menu-top__add-new list-item">
    //         <NavLink strict to="/add-new" exact activeClassName="active">
    //           Add New
    //         </NavLink>
    //       </li>
    //       <li className="navigation__side-bar__list__menu-top__calendar list-item">
    //         <NavLink
    //           strict
    //           to="/calendar"
    //           exact
    //           activeClassName="active"
    //         >
    //           Calendar
    //         </NavLink>
    //       </li>
    //       <li className="navigation__side-bar__list__menu-top__exams list-item">
    //         <NavLink strict to="/exams" exact activeClassName="active">
    //           Exams
    //         </NavLink>
    //       </li>
    //     </div>

    //     <div className="navigation__side-bar__list__menu-bottom">
    //       <li>
    //         <NavLink strict to="/profile" exact activeClassName="active">
    //           Profile Icon
    //         </NavLink>
    //       </li>
    //       <li>Dark mode</li>
    //       <li>
    //         <NavLink strict to="/imprint" exact activeClassName="active">
    //           Imprint
    //         </NavLink>
    //       </li>
    //       <li>
    //         <NavLink strict to="/data-policy" exact activeClassName="active">
    //           Data Policy
    //         </NavLink>
    //       </li>
    //     </div>
    //   </ul>
    // </nav>

    <nav className="navbar">
      <NavLink
        exact
        activeClassName="navbar__link--active"
        className="navbar__link"
        to="/"
      >
        Home
      </NavLink>
      <NavLink
        activeClassName="navbar__link--active"
        className="navbar__link"
        to="/products"
      >
        Products
      </NavLink>
      <NavLink
        activeClassName="navbar__link--active"
        className="navbar__link"
        to="/contacts"
      >
        Contacts
      </NavLink>
    </nav>
  )
}

export default Navbar
