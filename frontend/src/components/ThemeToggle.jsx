import { useState } from 'react'
import './ThemeToggle.css'

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    toggleDarkMode()
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <div className="theme-toggle-container">
      <button
        onClick={handleToggle}
        className={`theme-toggle ${isAnimating ? 'animating' : ''}`}
        aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      >
        <div className="toggle-track">
          <div className="toggle-thumb">
            <div className="toggle-icon">
              {darkMode ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"></circle>
                  <path d="m12 1 0 2"></path>
                  <path d="m12 21 0 2"></path>
                  <path d="m4.22 4.22 1.42 1.42"></path>
                  <path d="m18.36 18.36 1.42 1.42"></path>
                  <path d="m1 12 2 0"></path>
                  <path d="m21 12 2 0"></path>
                  <path d="m4.22 19.78 1.42-1.42"></path>
                  <path d="m18.36 5.64 1.42-1.42"></path>
                </svg>
              )}
            </div>
          </div>
          <div className="toggle-stars">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`star star-${i + 1}`}>✦</div>
            ))}
          </div>
          <div className="toggle-clouds">
            <div className="cloud cloud-1">☁</div>
            <div className="cloud cloud-2">☁</div>
            <div className="cloud cloud-3">☁</div>
          </div>
        </div>
        <span className="toggle-label">
          {darkMode ? 'Dark' : 'Light'} Mode
        </span>
      </button>
    </div>
  )
}

export default ThemeToggle