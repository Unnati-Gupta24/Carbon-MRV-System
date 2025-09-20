const { CONTRACT_ADDRESS, blockchainEnabled } = require('../models/blockchainModel')

const healthCheck = (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    contract: CONTRACT_ADDRESS || 'Not configured',
    blockchainEnabled: blockchainEnabled,
    features: {
      fileUpload: true,
      aiAnalysis: true,
      blockchain: blockchainEnabled,
    }
  })
}

module.exports = {
  healthCheck
}