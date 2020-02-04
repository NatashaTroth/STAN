import React from "react"

const Label = ({ labeltype, text }) => {
  return <label htmlFor={labeltype}>{text}</label>
}

// className={`${styles.label}`}

export default Label
