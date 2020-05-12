import React from "react"
import useDarkMode from "use-dark-mode"
// --------------------------------------------------------------

const DarkModeToggle = () => {
  const darkMode = useDarkMode(false)

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    darkMode.value = true
  }

  return (
    <button type="button" onClick={darkMode.toggle} className="dark-mode-btn">
      {darkMode.value ? "Light Mode" : "Dark Mode"}
    </button>
  )
}

export default DarkModeToggle
