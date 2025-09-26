import { useState } from 'react'
import './AuthModal.css'

const AuthModal = ({
  show,
  darkMode,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (email === 'guptaunnati031@gmail.com' && password === '123456') {
      setLoading(false)
      // Call the success handler from App.jsx
      onLoginSuccess && onLoginSuccess()
    } else {
      setError('Invalid email or password')
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className={`auth-modal-overlay ${darkMode ? 'dark' : 'light'}`}>
      {/* Bright dot animation background */}
      <div className="bright-dots-animation">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className={`bright-dot bright-dot-${i + 1}`}
            style={{
              '--delay': `${i * 0.3}s`,
              '--duration': `${3 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>Welcome to BlueChain</h2>
          <p>Sign in to access your carbon credit dashboard</p>
        </div>

        <div className="auth-modal-body">
          <div className="auth-step login-step">
            <div className="step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10,17 15,12 10,7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </div>
            <h3>Sign In</h3>
            <p>Enter your credentials to continue</p>
            
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="auth-btn primary"
                disabled={loading || !email || !password}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="auth-modal-footer">
          <p>🌱 Secure authentication for your carbon credits</p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal