import React from "react"

const Input = ({ value, onChange, label, placeholder, type, maxLength }) => {
  return (
    <input
      type={type}
      name={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      required
      //   className={`${styles.textInput}`}
    />
  )
}

export default Input
