import React from "react"
import { useLocation } from "react-router-dom"

function NoMatch404() {
  let location = useLocation()

  return (
    <div className="navigation__title">
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  )
}

export default NoMatch404
