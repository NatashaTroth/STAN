import React from "react"

const Input = ({
  value,
  onChange,
  label,
  placeholder,
  type,
  maxLength,
  id,
  className,
}) => {
  return (
    <input
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

export default Input
