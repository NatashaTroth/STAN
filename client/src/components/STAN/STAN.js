import React, { createContext, useContext, useState } from "react"
import { BrowserRouter as Router, NavLink } from "react-router-dom"
import { Cube } from "react-preloaders"
// --------------------------------------------------------------

// mutation & queries ----------------
import { CURRENT_USER } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"

// components ----------------
import BurgerButton from "../burger-button/BurgerButton"
import Content from "../content/Content"
import Backdrop from "../backdrop/Backdrop"

// images & logos ----------------
import Image from "../../components/image/Image"
import Logo from "../../images/icons/logo.svg"
import Pic1 from "../../images/icons/profile.png"

export const CurrentUserContext = createContext()

const Navbar = () => {
  // state ----------------
  const [isSideBarOpen, setSideBar] = useState(false)

  // query ----------------
  const { data, loading, error } = useQuery(CURRENT_USER)
  let currentUser

  if (loading) return <p className="loading">Loading...</p>
  if (error) return <p>Error :(</p>
  if (data && data.currentUser) {
    currentUser = data.currentUser
  }

  // variables ----------------
  let body,
    backdrop = null

  // functions & conditions ----------------
  const handleClickSidebar = () => {
    setSideBar(isSideBarOpen => !isSideBarOpen)
  }

  const closeSidebar = () => {
    setSideBar(false)
  }

  if (isSideBarOpen) backdrop = <Backdrop click={handleClickSidebar} />

  // return ----------------
  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Cube customLoading={loading} background="#ffffff" />
      <Router className="sidebar">
        <div className="burger">
          <div className={isSideBarOpen ? "close" : "open"}>
            <a href="/">
              <img src={Logo} alt="Stans Logo" className="burger__logo-img" />
            </a>
            <BurgerButton click={handleClickSidebar} />
          </div>
        </div>
        <nav className={isSideBarOpen ? "showNav" : "closeNav"}>
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
            {body}
            <ul className="sidebar__items__list">
              <div className="sidebar__items__list__menu-top">
                {!currentUser ? (
                  <li className="list-item list-item--logged-out">
                    <NavLink
                      strict
                      to="/"
                      exact
                      activeClassName="active"
                      onClick={closeSidebar}
                    >
                      Home
                    </NavLink>
                  </li>
                ) : null}

                {!currentUser ? (
                  <li className="list-item list-item--logged-out">
                    <NavLink
                      strict
                      to="/about"
                      exact
                      activeClassName="active"
                      onClick={closeSidebar}
                    >
                      About
                    </NavLink>
                  </li>
                ) : null}

                {!currentUser ? (
                  <li className="list-item list-item--logged-out">
                    <NavLink
                      strict
                      to="/login"
                      exact
                      activeClassName="active"
                      onClick={closeSidebar}
                    >
                      Login
                    </NavLink>
                  </li>
                ) : null}

                {currentUser ? (
                  <li className="sidebar__items__list__menu-top__dashboard list-item list-item--logged-in">
                    <NavLink
                      strict
                      to="/"
                      exact
                      activeClassName="active"
                      onClick={closeSidebar}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                ) : null}

                {currentUser ? (
                  <li className="sidebar__items__list__menu-top__add-new list-item list-item--logged-in">
                    <NavLink
                      strict
                      to="/add-new"
                      exact
                      activeClassName="active"
                      onClick={closeSidebar}
                    >
                      Add New
                    </NavLink>
                  </li>
                ) : null}

                {currentUser ? (
                  <li className="sidebar__items__list__menu-top__calendar list-item list-item--logged-in">
                    <NavLink
                      strict
                      to="/calendar"
                      exact
                      activeClassName="active"
                      onClick={closeSidebar}
                    >
                      Calendar
                    </NavLink>
                  </li>
                ) : null}

                {currentUser ? (
                  <li className="sidebar__items__list__menu-top__exams list-item list-item--logged-in">
                    <NavLink
                      strict
                      to="/exams"
                      exact
                      activeClassName="active"
                      onClick={closeSidebar}
                    >
                      Exams
                    </NavLink>
                  </li>
                ) : null}
              </div>

              <div className="sidebar__items__list__menu-bottom">
                {currentUser ? (
                  <li>
                    <NavLink
                      strict
                      to="/profile"
                      exact
                      activeClassName="active"
                      onClick={closeSidebar}
                    >
                      <Image
                        path={Pic1}
                        alt="Shape of a person as profile Icon"
                        className="profile-img"
                      />
                    </NavLink>
                  </li>
                ) : null}

                <li>Dark mode</li>
                <li>
                  <NavLink
                    strict
                    to="/imprint"
                    exact
                    activeClassName="active"
                    onClick={closeSidebar}
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
                    onClick={closeSidebar}
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
    </CurrentUserContext.Provider>
  )
}

export default Navbar
export const useCurrentUserValue = () => useContext(CurrentUserContext)
