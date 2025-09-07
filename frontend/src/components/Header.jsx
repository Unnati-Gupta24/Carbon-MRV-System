import { Leaf, Wallet } from 'lucide-react'

const Header = ({ account, balance, isConnected, isVerified, connectWallet, loading }) => {
  return (
    <header className="cyber-header">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="cyber-logo">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="cyber-title">Blue Carbon Registry</h1>
              <p className="cyber-subtitle">Blockchain-powered MRV System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="cyber-wallet">
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </div>
                    <div className="text-xs text-cyan-300">
                      {parseFloat(balance).toFixed(3)} MATIC
                    </div>
                  </div>
                  {isVerified && <div className="verified-badge">✓</div>}
                  <div className="status-indicator"></div>
                </div>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="cyber-button"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span className="text-white">Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2 text-white" />
                    <span className="text-white">Connect Wallet</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
