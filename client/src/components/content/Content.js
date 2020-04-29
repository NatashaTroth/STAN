import React, { lazy, Suspense } from "react"
import { Switch, Route, withRouter } from "react-router-dom"
// --------------------------------------------------------------

// pages component ----------------
const AddNew = lazy(() => import("../../pages/add-new-page/AddNewPage"))
const Calendar = lazy(() => import("../../pages/calendar-page/CalendarPage"))
const Exams = lazy(() => import("../../pages/exams-page/ExamsPage"))
const NoMatch404 = lazy(() => import("../../pages/no-match-page/404Page"))
const UserAccount = lazy(() =>
  import("../../pages/user-account-page/UserAccountPage")
)
const Imprint = lazy(() => import("../../pages/imprint-page/ImprintPage"))
const DataPolicy = lazy(() =>
  import("../../pages/data-policy-page/DataPolicyPage")
)
const Login = lazy(() => import("../../pages/login-page/LoginPage"))
const SignUp = lazy(() => import("../../pages/sign-up-page/SignUpPage"))
const Home = lazy(() => import("../../pages/home-page/HomePage"))
const About = lazy(() => import("../../pages/about-page/AboutPage"))
const LoginPopUp = lazy(() => import("../../components/login-popup/LoginPopUp"))
const ExamsDetails = lazy(() =>
  import("../../components/current-exam/ExamDetails")
)
const Loading = lazy(() => import("../loading/Loading"))

const Content = ({ location }) => {
  // return ----------------
  return (
    <main className="content">
      <Suspense fallback={<Loading />}>
        <Switch location={location}>
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/sign-up" component={SignUp} />
          <Route exact path="/popup" component={LoginPopUp} />

          <Route exact path="/add-new" component={AddNew} />
          <Route exact path="/calendar" component={Calendar} />
          <Route exact path="/exams" component={Exams} />
          <Route exact path="/exams/:subject" component={ExamsDetails} />
          <Route exact path="/profile" component={UserAccount} />

          <Route exact path="/imprint" component={Imprint} />
          <Route exact path="/data-policy" component={DataPolicy} />
          <Route path="*" component={NoMatch404} />
        </Switch>
      </Suspense>
    </main>
  )
}

export default withRouter(Content)
