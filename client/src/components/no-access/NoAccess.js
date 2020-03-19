import React from "react"
import Stan from "../../images/mascots/0-stressed-1.svg"
// --------------------------------------------------------------

function NoAccess() {
  // return ----------------
  return (
    <div className="nomatch">
      <div className="container-fluid">
        <div className="col-md-12">
          <div className="nomatch__headline">
            <h2>Ooops! 403 - You Shall Not Pass</h2>
          </div>

          <div className="nomatch__sub-headline">
            <h3>Uh oh, Stan is blocking the way!</h3>
          </div>

          <div className="nomatch__content">
            <p>
              Maybe you have a typo in the url? Or you meant to go to a
              different location?
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

export default NoAccess
