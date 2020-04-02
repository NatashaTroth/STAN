import React from "react"
// --------------------------------------------------------------

const Button = ({ variant, text, className, onClick }) => {
  // return ----------------
  return (
    <button
      type="submit"
      variant={variant}
      className={className}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button
