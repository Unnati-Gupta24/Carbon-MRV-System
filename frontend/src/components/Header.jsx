import { useState, useEffect } from 'react'
import './Header.css'

const Header = ({ 
  account, 
  balance, 
  isConnected, 
  isVerified, 
  connectWallet, 
  loading, 
  darkMode,
  // Auth props (optional for backward compatibility)
  isAuthenticated,
  userEmail,
  onLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showBalance, setShowBalance] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance) => {
    if (!balance || balance === '0') return '0.00'
    const num = parseFloat(balance)
    return num < 0.001 ? '< 0.001' : num.toFixed(4)
  }

  const truncateEmail = (email) => {
    if (!email) return ''
    if (email.length <= 25) return email
    return `${email.slice(0, 22)}...`
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-bg">
        <div className="header-gradient"></div>
        <div className="header-pattern"></div>
      </div>
      
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo hover-3d" data-tilt>
          <div className="logo-container">
            <div className="logo-icon">
              <div className="logo-symbol">🌱</div>
              <div className="logo-pulse"></div>
            </div>
            <div className="logo-text">
              <h1 className="logo-title">CarbonMRV</h1>
              <span className="logo-subtitle">Blockchain Carbon Credits</span>
            </div>
          </div>
        </div>

        {/* Auth Section (if authenticated) */}
        {isAuthenticated && (
          <div className="header-auth">
            <div className="auth-info hover-3d" data-tilt>
              <div className="auth-icon">👤</div>
              <div className="auth-content">
                <span className="auth-label">User</span>
                <span className="auth-value">{truncateEmail(userEmail)}</span>
              </div>
            </div>
            
            {onLogout && (
              <button 
                onClick={onLogout}
                className="logout-btn hover-3d"
                data-tilt
                title="Logout"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16,17 21,12 16,7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Status Indicators */}
        <div className="header-status">
          <div className="status-indicators">
            <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'} hover-3d`} data-tilt>
              <div className="status-dot"></div>
              <span className="status-text">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            {isConnected && (
              <div className={`verification-badge ${isVerified ? 'verified' : 'unverified'} hover-3d`} data-tilt>
                <div className="badge-icon">
                  {isVerified ? '✅' : '⏳'}
                </div>
                <span className="badge-text">
                  {isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Account Section */}
        <div className="header-account">
          {isConnected ? (
            <div className="account-info">
              <div 
                className="balance-display hover-3d"
                onMouseEnter={() => setShowBalance(true)}
                onMouseLeave={() => setShowBalance(false)}
                data-tilt
              >
                <div className="balance-icon">💰</div>
                <div className="balance-content">
                  <span className="balance-label">Balance</span>
                  <span className="balance-value">
                    {showBalance ? `${formatBalance(balance)} ETH` : '••••'}
                  </span>
                </div>
              </div>
              
              <div className="wallet-address hover-3d" data-tilt>
                <div className="address-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"/>
                  </svg>
                </div>
                <div className="address-content">
                  <span className="address-label">Wallet</span>
                  <span className="address-value">{formatAddress(account)}</span>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={connectWallet} 
              disabled={loading || !isAuthenticated}
              className="connect-wallet-btn hover-3d"
              data-tilt
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <div className="wallet-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                  </div>
                  <span>{isAuthenticated ? 'Connect Wallet' : 'Login First'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Network Status */}
      <div className="network-status">
        <div className="network-indicator hover-3d" data-tilt>
          <div className="network-dot pulse"></div>
          <span className="network-name">Ethereum Mainnet</span>
          <div className="network-speed">
            <span className="speed-label">Gas:</span>
            <span className="speed-value">~15 gwei</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header