import React from "react"
import Stan from "../../images/mascots/0-stressed-1.svg"

function NoMatch404() {
  // let location = useLocation()

  return (
    <div className="nomatch">
      <div className="container-fluid">
        <div className="col-md-12">
          <div className="nomatch__headline">
            <h2>Awww...Don't Cry.</h2>
          </div>

          <div className="nomatch__sub-headline">
            <h3>It's just a 404 Error!</h3>
          </div>

          <div className="nomatch__content">
            <p>
              What you're looking for may have been misplaced in Long Term
              Memory...
            </p>
          </div>

          <div className="nomatch__mascot">
            <img src={Stan} alt="Sad stan" className="nomatch__mascot--img" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoMatch404
