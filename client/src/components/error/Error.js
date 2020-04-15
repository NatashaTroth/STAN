import React from "react"
// --------------------------------------------------------------

const QueryError = () => {
  // return ----------------
  return (
    <div className="query-error">
      <div className="container-fluid">
        <div className="row">
          <div className="query-error__inner box-content">
            <div className="query-error__inner--headline">
              <h3>Something went wrong...</h3>
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
      </div>
    </div>
  )
}

export default QueryError
