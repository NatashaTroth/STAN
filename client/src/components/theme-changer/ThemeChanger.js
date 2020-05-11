import React from "react"
import useDarkMode from "use-dark-mode"

const DarkModeToggle = () => {
  const darkMode = useDarkMode(false)
  if (darkMode) {
    console.log("yes")
  }

  return (
    <button type="button" onClick={darkMode.toggle} className="dark-mode-btn">
      {darkMode.value ? "Light Mode" : "Dark Mode"}
    </button>
  )
}

export default DarkModeToggle
