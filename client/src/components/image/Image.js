import React from "react"
// --------------------------------------------------------------

const Image = ({ path, text, className }) => {
  // return ----------------
  return <img alt={text} src={path} className={className} />
}

export default Image
