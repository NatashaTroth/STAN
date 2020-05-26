import React from "react"
// --------------------------------------------------------------

const Listing = ({ text, className, link, linkText }) => {
  // return ----------------
  return (
    <li className={className}>
      <a href={link}>{linkText}</a>
      {text}
    </li>
  )
}

export default Listing
