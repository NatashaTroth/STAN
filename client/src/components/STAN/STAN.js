import React, { useState } from "react"
import { BrowserRouter as Router, Link, NavLink } from "react-router-dom"
import ThemeMode from "../theme-changer/ThemeChanger"
import useDarkMode from "use-dark-mode"
// --------------------------------------------------------------

// mutation & queries ----------------
import { CURRENT_USER } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"

// components ----------------
import BurgerButton from "../burger-button/BurgerButton"
import Content from "../content/Content"
import Backdrop from "../backdrop/Backdrop"
import QueryError from "../error/Error"
import Loading from "../loading/Loading"

// apolloClient cache ----------------
import { client } from "../../apolloClient"

// images & logos ----------------
import LogoDark from "../../images/icons/stan-logo-dark.svg"
import LogoLight from "../../images/icons/stan-logo-light.svg"

// helpers ----------------
import { decodeHtml } from "../../helpers/mascots"

const Navbar = () => {
  // variables ----------------
  let backdrop = null
  let Logo = LogoLight

  // dark mode specific ----------------
  const darkMode = useDarkMode(false)
  if (darkMode.value) {
    Logo = LogoLight
  } else {
    Logo = LogoDark
  }

  // state ----------------
  const [isSideBarOpen, setSideBar] = useState(false)

  // query ----------------
  const { loading, error } = useQuery(CURRENT_USER)

  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />

  // run query in cache ----------------
  const currentUser = client.readQuery({ query: CURRENT_USER }).currentUser

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
    <Router className="navigation">
      <div className="burger">
        <div className={isSideBarOpen ? "close-burger" : "open-burger"}>
          <Link to="/">
            <img src={Logo} alt="Stans Logo" className="burger__logo" />
          </Link>
          <BurgerButton click={handleClickSidebar} />
        </div>
      </div>

      <nav
        className={
          isSideBarOpen ? "show-responsive-nav" : "close-responsive-nav"
        }
      >
        <div className="navigation__items">
          <div className="navigation__items--logo">
            <Link to="/">
              <img src={Logo} alt="Stans Logo" />
            </Link>
          </div>

          <ul className="navigation__items--list">
            {/* PRIVATE ROUTES */}
            <div className="menu-top">
              {/* HOME & DASHBOARD */}
              {!currentUser ? (
                <li className="logged-out home">
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
              ) : (
                <li className="logged-in dashboard">
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
              )}

              {/* ABOUT & ADD NEW */}
              {!currentUser ? (
                <li className="logged-out about">
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
              ) : (
                <li className="logged-in add-new">
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
              )}

              {/* LOGIN & Calendar */}
              {!currentUser ? (
                <li className="logged-out login">
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
              ) : (
                <li className="logged-in calendar">
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
              )}

              {/* Exams */}
              {currentUser ? (
                <li className="logged-in exams">
                  <NavLink
                    strict
                    to="/exams"
                    activeClassName="active"
                    onClick={closeSidebar}
                  >
                    Exams
                  </NavLink>
                </li>
              ) : null}

              {/* USER PROFILE */}
              {currentUser ? (
                <li className="logged-in profile">
                  <span className="user-avatar">
                    {decodeHtml(currentUser.username).charAt(0)}
                  </span>
                  <NavLink
                    strict
                    to="/profile"
                    exact
                    activeClassName="active"
                    onClick={closeSidebar}
                  >
                    Profile
                  </NavLink>
                </li>
              ) : null}
            </div>

            {/* PUBLIC ROUTES */}
            <div className="menu-bottom">
              {/* Light/Dark mode */}
              <ThemeMode />
              <li className="imprint">
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
              <li className="data-policy">
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
  )
}

export default Navbar
