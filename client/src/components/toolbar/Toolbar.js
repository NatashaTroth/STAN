import React from "react"

// Burger Menu
import BurgerButton from "../burger-button/BurgerButton"

const toolbar = props => (
  <header>
    <div className="side-bar__burger-btn">
      <BurgerButton click={props.drawerClickHandler} />
    </div>
  </header>
)

export default toolbar
