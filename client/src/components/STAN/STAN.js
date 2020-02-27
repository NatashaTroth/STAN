import React, { Component } from "react"
import { BrowserRouter as Router, NavLink } from "react-router-dom"
import { CURRENT_USER } from "../../graphQL/queries"

import Logo from "../../images/icons/logo.svg"

// components
import BurgerButton from "../burger-button/BurgerButton"
import Content from "../content/Content"
import Backdrop from "../backdrop/Backdrop"

class Navbar extends Component {
  state = {
    isSidebarOpen: false,
    // loading: true,
    // redirect: false,
  }

  handleClickSidebar = () => {
    this.setState({
      isSidebarOpen: !this.state.isSidebarOpen,
    })
  }

  closeSidebar = () => {
    this.setState({
      isSidebarOpen: false,
    })
  }

  // componentDidMount() {
  //   fetch("/refresh_token")
  //     .then(res => {
  //       if (res.status === 200) {
  //         this.setState({ loading: false })
  //       } else {
  //         const error = new Error(res.error)
  //         throw error
  //       }
  //     })
  //     .catch(err => {
  //       console.error(err)
  //       this.setState({ loading: false, redirect: true })
  //     })
  // }

  render() {
    let backdrop
    if (this.state.isSidebarOpen) {
      backdrop = <Backdrop click={this.handleClickSidebar} />
    }

    return (
      <Router className="sidebar">
        <div className="burger">
          <div className={this.state.isSidebarOpen ? "close" : "open"}>
            <BurgerButton click={this.handleClickSidebar} />
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
                  <NavLink
                    strict
                    to="/"
                    exact
                    activeClassName="active"
                    onClick={this.closeSidebar}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="sidebar__items__list__menu-top__add-new list-item">
                  <NavLink
                    strict
                    to="/add-new"
                    exact
                    activeClassName="active"
                    onClick={this.closeSidebar}
                  >
                    Add New
                  </NavLink>
                </li>
                <li className="sidebar__items__list__menu-top__calendar list-item">
                  <NavLink
                    strict
                    to="/calendar"
                    exact
                    activeClassName="active"
                    onClick={this.closeSidebar}
                  >
                    Calendar
                  </NavLink>
                </li>
                <li className="sidebar__items__list__menu-top__exams list-item">
                  <NavLink
                    strict
                    to="/exams"
                    exact
                    activeClassName="active"
                    onClick={this.closeSidebar}
                  >
                    Exams
                  </NavLink>
                </li>
              </div>

              <div className="sidebar__items__list__menu-bottom">
                <li>
                  <NavLink
                    strict
                    to="/profile"
                    exact
                    activeClassName="active"
                    onClick={this.closeSidebar}
                  >
                    Profile Icon
                  </NavLink>
                </li>
                <li>Dark mode</li>
                <li>
                  <NavLink
                    strict
                    to="/imprint"
                    exact
                    activeClassName="active"
                    onClick={this.closeSidebar}
                  >
                    Imprint
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    strict
                    to="/data-policy"
                    exact
                    activeClassName="active"
                    onClick={this.closeSidebar}
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
