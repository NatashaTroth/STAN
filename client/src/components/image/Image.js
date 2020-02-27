import React from "react"

const Image = ({ text, source, className }) => {
  return <img alt={text} src={source} className={className} />
}

export default Image
