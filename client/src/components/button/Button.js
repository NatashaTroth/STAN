import React from "react"

const Button = ({ variant, text, className, onClick }) => {
  return (
    <button
      variant={variant}
      //   className={`${className} ${styles.button}`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default Button
