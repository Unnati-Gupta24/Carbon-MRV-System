import { useState } from 'react'

const CarbonRewards = () => {
  const [isTransferring, setIsTransferring] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [transactionComplete, setTransactionComplete] = useState(false)

  const carbonCredits = 150
  const rewardAmount = "0.0000000001"
  const projectDetails = {
    vegetationHealth: 'Excellent',
    area_detected: 45.7,
    location: 'Amazon Rainforest Sector-7',
    verificationDate: new Date().toLocaleDateString(),
  }

  const claimRewards = async () => {
    try {
      setIsTransferring(true)

      // Check if MetaMask is available
      if (!window.ethereum) {
        alert('MetaMask not detected! Please install MetaMask to claim your rewards.')
        return
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length === 0) {
        alert('No accounts found! Please connect your wallet.')
        return
      }

      // Send MATIC reward transaction
      const txParams = {
        from: accounts[0],
        to: '0x92d455FA2be16660cEe3437C1395Db95E624627a',
        value: '0x5AF3107A4000', // 0.0000000001 MATIC in hex
        gas: '0x5208',
      }

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      })

      console.log('Reward transaction sent:', txHash)
      setTransactionComplete(true)
      setShowCertificate(true)
    } catch (error) {
      console.error('Reward claim failed:', error)
      if (error.code === 4001) {
        alert('Transaction rejected by user')
      } else {
        alert('Failed to claim rewards: ' + error.message)
      }
    } finally {
      setIsTransferring(false)
    }
  }

  const downloadCertificate = () => {
    // Create a funky certificate design
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    canvas.width = 800
    canvas.height = 600
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, '#1a1a2e')
    gradient.addColorStop(0.5, '#16213e')
    gradient.addColorStop(1, '#0f3460')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Add border
    ctx.strokeStyle = '#00ff9f'
    ctx.lineWidth = 8
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)
    
    // Add inner border
    ctx.strokeStyle = '#ff6b6b'
    ctx.lineWidth = 2
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)
    
    // Title
    ctx.fillStyle = '#00ff9f'
    ctx.font = 'bold 36px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🌿 CARBON CREDIT CERTIFICATE 🌿', canvas.width / 2, 100)
    
    // Subtitle
    ctx.fillStyle = '#ff6b6b'
    ctx.font = 'bold 24px Arial'
    ctx.fillText('◢ ENVIRONMENTAL HERO AWARD ◤', canvas.width / 2, 140)
    
    // Main content
    ctx.fillStyle = '#ffffff'
    ctx.font = '20px Arial'
    ctx.fillText(`This certifies that you have earned`, canvas.width / 2, 200)
    
    ctx.fillStyle = '#00ff9f'
    ctx.font = 'bold 48px Arial'
    ctx.fillText(`${carbonCredits} CARBON CREDITS`, canvas.width / 2, 260)
    
    ctx.fillStyle = '#ffffff'
    ctx.font = '18px Arial'
    ctx.fillText(`Project Location: ${projectDetails.location}`, canvas.width / 2, 320)
    ctx.fillText(`Area Protected: ${projectDetails.area_detected} hectares`, canvas.width / 2, 350)
    ctx.fillText(`Vegetation Status: ${projectDetails.vegetationHealth}`, canvas.width / 2, 380)
    ctx.fillText(`Verification Date: ${projectDetails.verificationDate}`, canvas.width / 2, 410)
    
    // Reward info
    ctx.fillStyle = '#ff6b6b'
    ctx.font = 'bold 20px Arial'
    ctx.fillText(`Reward Claimed: ${rewardAmount} MATIC`, canvas.width / 2, 460)
    
    // Footer
    ctx.fillStyle = '#00ff9f'
    ctx.font = '16px Arial'
    ctx.fillText('🚀 POWERED BY BLOCKCHAIN TECHNOLOGY 🚀', canvas.width / 2, 520)
    
    ctx.fillStyle = '#ffffff'
    ctx.font = '12px Arial'
    ctx.fillText('Thank you for helping save our planet!', canvas.width / 2, 550)
    
    // Download the certificate
    const link = document.createElement('a')
    link.download = `carbon-credit-certificate-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 mb-4">
              🏆 YOUR CARBON REWARDS 🏆
            </h1>
            <p className="text-gray-300 text-lg">
              Congratulations! You've earned rewards for your environmental impact
            </p>
            <div className="h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent mt-4"></div>
          </div>

          <div className="bg-black/60 backdrop-blur-lg border border-green-500/50 rounded-2xl p-8 shadow-2xl shadow-green-500/20">
            {/* Rewards Summary */}
            <div className="text-center mb-8">
              <div className="inline-block bg-gradient-to-r from-green-500 to-cyan-500 p-6 rounded-full mb-4">
                <span className="text-4xl">🌱</span>
              </div>
              <h2 className="text-3xl font-bold text-green-400 mb-2">
                {carbonCredits} Carbon Credits Earned!
              </h2>
              <p className="text-gray-300">
                Your contribution to environmental conservation has been verified
              </p>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center">
                  <span className="mr-2">🌿</span> Project Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white font-medium">{projectDetails.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Area Protected:</span>
                    <span className="text-white font-medium">{projectDetails.area_detected} hectares</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vegetation Health:</span>
                    <span className="text-green-400 font-medium">{projectDetails.vegetationHealth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Verified On:</span>
                    <span className="text-white font-medium">{projectDetails.verificationDate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-purple-400 font-bold text-lg mb-4 flex items-center">
                  <span className="mr-2">💰</span> Reward Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reward Amount:</span>
                    <span className="text-purple-400 font-bold">{rewardAmount} MATIC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-white font-medium">Polygon</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction Type:</span>
                    <span className="text-cyan-400 font-medium">Reward Transfer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`font-medium ${transactionComplete ? 'text-green-400' : 'text-yellow-400'}`}>
                      {transactionComplete ? 'Completed ✅' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              {!transactionComplete ? (
                <button
                  onClick={claimRewards}
                  disabled={isTransferring}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isTransferring
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-cyan-500 text-white hover:from-green-600 hover:to-cyan-600 hover:shadow-lg hover:scale-105'
                  }`}
                >
                  {isTransferring ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Processing Transaction...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span>💎</span> Claim Your Rewards <span>💎</span>
                    </span>
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="text-green-400 font-bold text-xl">
                    🎉 Rewards Successfully Claimed! 🎉
                  </div>
                  <button
                    onClick={downloadCertificate}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg rounded-xl hover:from-pink-600 hover:to-purple-600 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>📜</span> Download Funky Certificate <span>🎨</span>
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Network Info */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-full">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-400 font-mono text-sm">
                  POLYGON AMOY TESTNET
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-500 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-green-500/30">
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-bold text-green-400 mb-4">
                Mission Accomplished!
              </h2>
              <p className="text-gray-300 mb-6">
                Your carbon credit rewards have been successfully transferred to your wallet!
              </p>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <div className="text-green-400 font-bold">Transaction Complete ✅</div>
                <div className="text-sm text-gray-300 mt-1">
                  {rewardAmount} MATIC transferred successfully
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadCertificate}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
                >
                  📜 Get Certificate
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarbonRewards