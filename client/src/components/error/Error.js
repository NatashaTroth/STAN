import React from "react"
// --------------------------------------------------------------

const QueryError = () => {
  // return ----------------
  return (
    <div className="query-error">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-1"></div>
          <div className="col-lg-6">
            <div className="query-error__inner">
              <div className="query-error__inner--headline">
                <h2>Something went wrong...</h2>
              </div>

              <div className="query-error__inner--text">
                <p>
                  The server isn't responding. We are working on getting this
                  fixed as soon as we can.
                </p>
              </div>

              <div className="query-error__inner--button">
                <a href="/" className="stan-btn-primary">
                  Home
                </a>
                -
              </div>
            </div>
          </div>
          <div className="col-lg-5"></div>
        </div>
      </div>
    </div>
  )
}

export default QueryError
