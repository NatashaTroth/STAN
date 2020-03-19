import React from "react"
// --------------------------------------------------------------

const Label = ({ labeltype, text, className }) => {
  // return ----------------
  return (
    <label htmlFor={labeltype} className={className}>
      {text}
    </label>
  )
}

export default Label
