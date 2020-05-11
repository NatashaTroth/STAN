import React, { useState, useEffect } from "react"

const ThemeChanger = () => {
  const [themeState, setThemeState] = useState(false)

  const handleChange = () => {
    setThemeState(!themeState)

    console.log(themeState)

    if (themeState) {
      localStorage.setItem("Theme", "light")
      document.body.classList.remove("dark-mode")
      console.log("light")
    } else {
      localStorage.setItem("Theme", "dark")
      document.body.classList.add("dark-mode")
      console.log("dark")
    }
  }
  useEffect(() => {
    const getTheme = localStorage.getItem("Theme")
    if (getTheme === "dark") return document.body.classList.add("dark-mode")
  })
  return (
    <div>
      <button onClick={handleChange} className="dark-mode-btn">
        {themeState ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  )
}

export default ThemeChanger
