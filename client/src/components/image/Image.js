import React from "react"

const Image = ({ path, text, className }) => {
  return <img alt={text} src={path} className={className} />
}

export default Image
