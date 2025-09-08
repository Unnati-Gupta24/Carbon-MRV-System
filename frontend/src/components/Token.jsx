import { useState } from 'react'

const Token = () => {
  const [isMinting, setIsMinting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [nftImage, setNftImage] = useState('')

  // Mock data
  const carbonCredits = 150
  const projectDetails = {
    vegetationHealth: 'Excellent',
    area_detected: 45.7,
    location: 'Amazon Rainforest Sector-7',
    verificationDate: new Date().toLocaleDateString()
  }

  const generateRandomNFT = () => {
    const colors = ['#00ff88', '#0099ff', '#ff0080', '#ffff00', '#ff8800', '#8800ff']
    const shapes = ['circle', 'rect', 'polygon']
    const randomColor1 = colors[Math.floor(Math.random() * colors.length)]
    const randomColor2 = colors[Math.floor(Math.random() * colors.length)]
    const randomId = Math.floor(Math.random() * 10000)

    return `data:image/svg+xml;base64,${btoa(`
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad${randomId}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${randomColor1};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${randomColor2};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="#000012"/>
        <circle cx="200" cy="150" r="${50 + Math.random() * 50}" fill="url(#grad${randomId})" opacity="0.8"/>
        <rect x="${100 + Math.random() * 100}" y="${200 + Math.random() * 50}" width="${50 + Math.random() * 50}" height="${50 + Math.random() * 50}" fill="${randomColor1}" opacity="0.6"/>
        <polygon points="${150 + Math.random() * 100},${250 + Math.random() * 50} ${200 + Math.random() * 100},${300 + Math.random() * 50} ${250 + Math.random() * 100},${200 + Math.random() * 50}" fill="${randomColor2}" opacity="0.7"/>
        <text x="200" y="50" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#ffffff">Carbon Credit NFT</text>
        <text x="200" y="80" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#cccccc">${carbonCredits} Credits</text>
        <text x="200" y="370" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#888888">#${randomId}</text>
      </svg>
    `)}`
  }

  const mintNFT = async () => {
    try {
      setIsMinting(true)

      // Check if MetaMask is available
      if (!window.ethereum) {
        alert('MetaMask not detected!')
        return
      }

      // Get accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length === 0) {
        alert('No accounts found!')
        return
      }

      // Send 0.0000000001 MATIC transaction
      const txParams = {
        from: accounts[0],
        to: '0x92d455FA2be16660cEe3437C1395Db95E624627a', // This looks like a Solana address, using as is
        value: '0x5AF3107A4000', // 0.0000000001 ETH/MATIC in hex (100000000 wei)
        gas: '0x5208', // 21000 gas limit
      }

      // Show MetaMask popup for transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      })

      console.log('Transaction sent:', txHash)

      // Generate random NFT image
      const generatedImage = generateRandomNFT()
      setNftImage(generatedImage)

      // Show success modal
      setShowSuccessModal(true)

    } catch (error) {
      console.error('Minting failed:', error)
      if (error.code === 4001) {
        alert('Transaction rejected by user')
      } else {
        alert('Minting failed: ' + error.message)
      }
    } finally {
      setIsMinting(false)
    }
  }

  const downloadNFT = () => {
    // Convert base64 to blob and download
    const base64Data = nftImage.split(',')[1]
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: 'image/svg+xml' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `carbon-credit-nft-${Date.now()}.svg`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cyberpunk background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(255,255,255,0.03)_25px,rgba(255,255,255,0.03)_26px,transparent_27px,transparent_74px,rgba(255,255,255,0.03)_75px,rgba(255,255,255,0.03)_76px,transparent_77px,transparent)] bg-[length:100px_100px]"></div>
      
      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-green-400 to-purple-400 mb-2">
              ◢ NEURAL NFT MINTER ◤
            </h1>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          </div>

          <div className="bg-black/80 border border-cyan-500/50 rounded-lg p-6 backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,255,0.3)]">
            
            {/* Project Data Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left Panel */}
              <div className="space-y-4">
                <div className="border border-green-500/30 bg-green-500/10 p-4 rounded">
                  <h3 className="text-green-400 font-mono text-sm mb-3">◢ CARBON DATA MATRIX ◤</h3>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">[CREDITS]:</span>
                      <span className="text-green-400 font-bold">{carbonCredits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">[BIO_STATUS]:</span>
                      <span className="text-cyan-400">{projectDetails.vegetationHealth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">[AREA_HA]:</span>
                      <span className="text-white">{projectDetails.area_detected.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-purple-500/30 bg-purple-500/10 p-4 rounded">
                  <h3 className="text-purple-400 font-mono text-sm mb-3">◢ MINTING INFO ◤</h3>
                  <div className="space-y-2 text-sm font-mono">
                    <div>
                      <span className="text-gray-400">[COST]: </span>
                      <span className="text-purple-400">0.0000000001 MATIC</span>
                    </div>
                    <div>
                      <span className="text-gray-400">[NETWORK]: </span>
                      <span className="text-white">Polygon</span>
                    </div>
                    <div>
                      <span className="text-gray-400">[TYPE]: </span>
                      <span className="text-cyan-400">Generative NFT</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Preview */}
              <div className="border border-cyan-500/30 bg-cyan-500/5 p-4 rounded">
                <h3 className="text-cyan-400 font-mono text-sm mb-3">◢ NFT PREVIEW ◤</h3>
                <div className="aspect-square bg-black/50 rounded border border-green-500/30 flex items-center justify-center">
                  <div className="text-gray-500 font-mono text-sm">
                    Random NFT will be generated after minting
                  </div>
                </div>
              </div>
            </div>

            {/* Mint Button */}
            <div className="text-center">
              <button
                onClick={mintNFT}
                disabled={isMinting}
                className={`relative px-8 py-4 font-mono text-lg font-bold transition-all duration-300 ${
                  isMinting
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-600 via-green-500 to-purple-600 text-white hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] hover:scale-105'
                } rounded-lg border-2 border-transparent hover:border-cyan-400/50`}
              >
                {isMinting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    PROCESSING...
                  </span>
                ) : (
                  '◢ MINT NFT ◤'
                )}
              </button>
            </div>
          </div>

          {/* Network Info */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-full">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-purple-400 font-mono text-xs">POLYGON AMOY TESTNET</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border-2 border-green-500 rounded-lg p-8 max-w-md w-full mx-4 shadow-[0_0_30px_rgba(0,255,0,0.3)]">
            <div className="text-center">
              <h2 className="text-2xl font-mono text-green-400 mb-4">◢ NFT MINTED ◤</h2>
              
              {/* Show the generated NFT */}
              <div className="mb-6">
                <img 
                  src={nftImage} 
                  alt="Generated NFT" 
                  className="w-full max-w-xs mx-auto border border-green-500/50 rounded"
                />
              </div>

              <p className="text-gray-300 font-mono text-sm mb-6">
                Your Carbon Credit NFT has been successfully minted!
              </p>

              <div className="flex gap-4">
                <button
                  onClick={downloadNFT}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-mono text-sm rounded transition-all"
                >
                  ◢ DOWNLOAD ◤
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-mono text-sm rounded transition-all"
                >
                  ◢ CLOSE ◤
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Token