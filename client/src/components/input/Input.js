import React, { forwardRef } from "react"

const Input = (
  { value, onChange, label, placeholder, type, maxLength, id, className },
  ref
) => {
  return (
    <input
      ref={ref}
      type={type}
      id={id}
      name={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className={className}
    />
  )
}

export default forwardRef(Input)
