import React from "react"

const burgerButton = props => (
  <div className={props.isSidebarOpen ? "open" : "close"}>
    <button className="burger__btn" onClick={props.click}>
      <div className="burger__btn__line" />
      <div className="burger__btn__line" />
      <div className="burger__btn__line" />
    </button>
  </div>
)

export default burgerButton
