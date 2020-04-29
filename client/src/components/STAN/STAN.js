import React, {
  createContext,
  useContext,
  useState,
  lazy,
  Suspense,
} from "react"
import { BrowserRouter as Router, Link, NavLink } from "react-router-dom"
// --------------------------------------------------------------

// mutation & queries ----------------
import { CURRENT_USER } from "../../graphQL/queries"
import { useQuery } from "@apollo/react-hooks"

// images & logos ----------------
import Image from "../../components/image/Image"
import Logo from "../../images/icons/logo.svg"
import Pic1 from "../../images/icons/profile.png"

// components ----------------
const BurgerButton = lazy(() => import("../burger-button/BurgerButton"))
const Content = lazy(() => import("../content/Content"))
const Backdrop = lazy(() => import("../backdrop/Backdrop"))
const QueryError = lazy(() => import("../error/Error"))
const Loading = lazy(() => import("../loading/Loading"))

export const CurrentUserContext = createContext()

const Navbar = () => {
  // state ----------------
  const [isSideBarOpen, setSideBar] = useState(false)

  // query ----------------
  const { data, loading, error } = useQuery(CURRENT_USER)
  let currentUser

  if (loading) return <Loading />
  if (error) return <QueryError errorMessage={error.message} />
  if (data && data.currentUser) {
    currentUser = data.currentUser
  }

  // variables ----------------
  let backdrop = null

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
      <Suspense fallback={<Loading />}>
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
                        exact
                        activeClassName="active"
                        onClick={closeSidebar}
                      >
                        Exams
                      </NavLink>
                    </li>
                  ) : null}
                </div>

                <div className="menu-bottom">
                  {/* USER PROFILE */}
                  {currentUser ? (
                    <li className="profile">
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

                  {/* PUBLIC ROUTES */}
                  <li className="dark-mode">Dark mode</li>
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
      </Suspense>
    </CurrentUserContext.Provider>
  )
}

export default Navbar
export const useCurrentUserValue = () => useContext(CurrentUserContext)
