import React from "react"
// --------------------------------------------------------------

const Button = ({ variant, text, className, onClick, disabled }) => {
  // return ----------------
  return (
    <button
      type="submit"
      variant={variant}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button
