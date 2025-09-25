import { useState } from 'react'
import './Token.css'

const CarbonRewards = () => {
  const [isTransferring, setIsTransferring] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [transactionComplete, setTransactionComplete] = useState(false)

  const carbonCredits = 150
  const rewardAmount = '0.0000000001'
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
        alert(
          'MetaMask not detected! Please install MetaMask to claim your rewards.'
        )
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
    ctx.fillText(
      `Project Location: ${projectDetails.location}`,
      canvas.width / 2,
      320
    )
    ctx.fillText(
      `Area Protected: ${projectDetails.area_detected} hectares`,
      canvas.width / 2,
      350
    )
    ctx.fillText(
      `Vegetation Status: ${projectDetails.vegetationHealth}`,
      canvas.width / 2,
      380
    )
    ctx.fillText(
      `Verification Date: ${projectDetails.verificationDate}`,
      canvas.width / 2,
      410
    )

    // Reward info
    ctx.fillStyle = '#ff6b6b'
    ctx.font = 'bold 20px Arial'
    ctx.fillText(`Reward Claimed: ${rewardAmount} MATIC`, canvas.width / 2, 460)

    // Footer
    ctx.fillStyle = '#00ff9f'
    ctx.font = '16px Arial'
    ctx.fillText(
      '🚀 POWERED BY BLOCKCHAIN TECHNOLOGY 🚀',
      canvas.width / 2,
      520
    )

    ctx.fillStyle = '#ffffff'
    ctx.font = '12px Arial'
    ctx.fillText(
      'Thank you for helping save our planet!',
      canvas.width / 2,
      550
    )

    // Download the certificate
    const link = document.createElement('a')
    link.download = `carbon-credit-certificate-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Carbon Credit Rewards
          </h1>
          <p className="text-text-secondary">
            Convert your environmental impact into digital assets
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card-bg border border-border-color rounded-lg p-6 shadow-lg">
          {/* Credits Summary */}
          <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">
                {carbonCredits} Credits
              </h2>
              <p className="text-text-secondary">Available for conversion</p>
            </div>
            <div className="text-4xl">🌿</div>
          </div>

          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Project Info */}
            <div className="card p-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Project Details
              </h3>
              <div className="space-y-3">
                <InfoRow label="Location" value={projectDetails.location} />
                <InfoRow
                  label="Area Protected"
                  value={`${projectDetails.area_detected} hectares`}
                />
                <InfoRow
                  label="Vegetation Health"
                  value={projectDetails.vegetationHealth}
                  highlight="success"
                />
                <InfoRow
                  label="Verification Date"
                  value={projectDetails.verificationDate}
                />
              </div>
            </div>

            {/* Reward Info */}
            <div className="card p-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Reward Information
              </h3>
              <div className="space-y-3">
                <InfoRow
                  label="Reward Amount"
                  value={`${rewardAmount} MATIC`}
                  highlight="primary"
                />
                <InfoRow label="Network" value="Polygon" />
                <InfoRow
                  label="Status"
                  value={transactionComplete ? 'Completed' : 'Pending'}
                  highlight={transactionComplete ? 'success' : 'warning'}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4 mt-8">
            {!transactionComplete ? (
              <button
                onClick={claimRewards}
                disabled={isTransferring}
                className="button w-full md:w-auto px-8 py-3 disabled:opacity-50"
              >
                {isTransferring ? (
                  <div className="flex items-center gap-2">
                    <div className="loading-spinner" />
                    Processing...
                  </div>
                ) : (
                  'Claim Rewards'
                )}
              </button>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-success font-medium">
                  ✅ Rewards Successfully Claimed
                </div>
                <button
                  onClick={downloadCertificate}
                  className="button-secondary w-full md:w-auto px-8 py-3"
                >
                  Download Certificate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Network Badge */}
        <div className="text-center mt-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-card-bg border border-border-color rounded-full text-sm text-text-secondary">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Polygon Network
          </span>
        </div>
      </div>

      {/* Success Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card-bg border border-border-color rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">
                Transaction Complete
              </h2>
              <p className="text-text-secondary">
                Your rewards have been successfully transferred
              </p>
              <div className="flex gap-3 mt-6">
                <button onClick={downloadCertificate} className="button flex-1">
                  Download Certificate
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="button-secondary flex-1"
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

// Helper Component
const InfoRow = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center">
    <span className="text-text-secondary">{label}</span>
    <span
      className={`font-medium ${
        highlight === 'success'
          ? 'text-success'
          : highlight === 'warning'
          ? 'text-warning'
          : highlight === 'primary'
          ? 'text-accent'
          : 'text-text-primary'
      }`}
    >
      {value}
    </span>
  </div>
)

export default CarbonRewards
