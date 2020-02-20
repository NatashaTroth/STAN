import React, { Component } from "react"
import { BrowserRouter as Router, NavLink } from "react-router-dom"

import Logo from "../../images/icons/logo.svg"

// TABLET: width 70%:
// Mobile: volle Breite mit X im Screen

// components
import BurgerButton from "../burger-button/BurgerButton"
import Content from "../content/Content"
import Backdrop from "../backdrop/Backdrop"

class Navbar extends Component {
  state = {
    isSidebarOpen: false,
  }

  handleClickSidebar = () => {
    this.setState({
      isSidebarOpen: !this.state.isSidebarOpen,
    })
  }

  render() {
    let backdrop
    if (this.state.isSidebarOpen) {
      backdrop = <Backdrop click={this.handleClickSidebar} />
    }

    return (
      <Router className="sidebar">
        {/* <BurgerButton click={this.handleClickSidebar} /> */}
        <div className="burger">
          <div className={this.state.isSidebarOpen ? "close" : "open"}>
            <button className="burger__btn" onClick={this.handleClickSidebar}>
              <div className="burger__btn__line line-1" />
              <div className="burger__btn__line line-2" />
              <div className="burger__btn__line line-3" />
            </button>
          </div>
        </div>

        <nav className={this.state.isSidebarOpen ? "showNav" : "closeNav"}>
          <div className="sidebar__items">
            <div className="sidebar__items__logo">
              <a href="/">
                <img
                  src={Logo}
                  alt="Stans Logo"
                  className="sidebar__items__logo--img"
                />
              </a>
            </div>
            <ul className="sidebar__items__list">
              <div className="sidebar__items__list__menu-top">
                <li className="sidebar__items__list__menu-top__dashboard list-item">
                  <NavLink strict to="/" exact activeClassName="active">
                    Dashboard
                  </NavLink>
                </li>
                <li className="sidebar__items__list__menu-top__add-new list-item">
                  <NavLink strict to="/add-new" exact activeClassName="active">
                    Add New
                  </NavLink>
                </li>
                <li className="sidebar__items__list__menu-top__calendar list-item">
                  <NavLink strict to="/calendar" exact activeClassName="active">
                    Calendar
                  </NavLink>
                </li>
                <li className="sidebar__items__list__menu-top__exams list-item">
                  <NavLink strict to="/exams" exact activeClassName="active">
                    Exams
                  </NavLink>
                </li>
              </div>

              <div className="sidebar__items__list__menu-bottom">
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
          </div>
        </nav>

        {backdrop}
        <Content />
      </Router>
    )
  }
}

export default Navbar
