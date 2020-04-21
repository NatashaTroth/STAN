import React from "react"
// --------------------------------------------------------------

// sub-components ----------------
import Image from "../image/Image"

// mascots ----------------
import LoadingMascot from "../../images/mascots/loadingMascot.svg"

const Loading = () => {
  // return ----------------
  return (
    <div className="loader">
      <div className="loader__headline">
        <h4>Loading...</h4>
      </div>

      <div className="loader__image">
        <Image path={LoadingMascot} text="sleepy mascot" />
      </div>
    </div>
  )
}

export default Loading
