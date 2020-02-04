import React from "react"

const Textarea = ({
  value,
  onChange,
  label,
  placeholder,
  maxLength,
  id,
  className,
}) => {
  return (
    <textarea
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

export default Textarea
