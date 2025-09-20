const { contract, blockchainEnabled, wallet } = require('../models/blockchainModel')

const getAdmin = async (req, res) => {
  try {
    if (!blockchainEnabled || !contract) {
      return res.json({ 
        admin: null,
        note: 'Blockchain functionality not available'
      })
    }

    const adminAddress = await contract.admin()

    res.json({ admin: adminAddress })
  } catch (error) {
    console.error('❌ Error getting admin address:', error)
    res.status(500).json({ error: 'Failed to get admin address', details: error.message })
  }
}

const verifyOrganization = async (req, res) => {
  try {
    const { organizationAddress } = req.body

    if (!organizationAddress) {
      return res.status(400).json({ error: 'Organization address is required' })
    }

    if (!blockchainEnabled || !contract) {
      return res.status(503).json({ 
        error: 'Blockchain functionality not available',
        message: 'Contract ABI not configured'
      })
    }

    const adminAddress = await contract.admin()
    const currentAddress = wallet.address

    if (adminAddress.toLowerCase() !== currentAddress.toLowerCase()) {
      return res.status(403).json({ 
        error: 'Only admin can verify organizations',
        admin: adminAddress,
        current: currentAddress
      })
    }

    const tx = await contract.addVerifiedOrganization(organizationAddress)
    const receipt = await tx.wait()

    res.json({
      success: true,
      transactionHash: receipt.transactionHash,
      verifiedAddress: organizationAddress
    })

  } catch (error) {
    console.error('❌ Error verifying organization:', error)
    res.status(500).json({ error: 'Failed to verify organization', details: error.message })
  }
}

module.exports = {
  getAdmin,
  verifyOrganization
}