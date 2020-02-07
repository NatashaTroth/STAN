import React from "react"

// Burger Menu
import BurgerButton from "../burger-button/BurgerButton"

const toolbar = props => (
  <header>
    <h1 className="hide">Stan - online study plan</h1>
    <div className="side-bar__burger-btn">
      <BurgerButton click={props.drawerClickHandler} />
    </div>
  </header>
)

export default toolbar
