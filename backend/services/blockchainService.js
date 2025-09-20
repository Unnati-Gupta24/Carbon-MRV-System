const { ethers } = require('ethers')
require('dotenv').config()

let contract = null
let wallet = null
let blockchainEnabled = false

const {
  RPC_URL,
  PRIVATE_KEY,
  CONTRACT_ADDRESS,
  CONTRACT_ABI_PATH,
} = process.env

if (RPC_URL && PRIVATE_KEY && CONTRACT_ADDRESS && CONTRACT_ABI_PATH) {
  try {
    const abi = require(CONTRACT_ABI_PATH)
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet)
    blockchainEnabled = true
  } catch (error) {
    console.error('❌ Failed to connect to blockchain:', error.message)
  }
}

module.exports = {
  contract,
  wallet,
  blockchainEnabled
}
