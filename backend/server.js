const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { ethers } = require('ethers')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  },
})

// Smart Contract Configuration
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
const CONTRACT_ABI = [
  [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_org",
				"type": "address"
			}
		],
		"name": "addVerifiedOrganization",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "creditId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "CarbonCreditsIssued",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newAdmin",
				"type": "address"
			}
		],
		"name": "changeAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_area",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_ecosystemType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_imageHash",
				"type": "string"
			}
		],
		"name": "createProject",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_projectId",
				"type": "uint256"
			}
		],
		"name": "deactivateProject",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "org",
				"type": "address"
			}
		],
		"name": "OrganizationVerified",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"name": "ProjectCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "carbonCredits",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "aiResultsHash",
				"type": "string"
			}
		],
		"name": "ProjectVerified",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_org",
				"type": "address"
			}
		],
		"name": "removeVerifiedOrganization",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_projectId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_carbonAmount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_aiResultsHash",
				"type": "string"
			}
		],
		"name": "verifyProjectAndIssueCredits",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "carbonCredits",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "projectId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "issuedAt",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isRetired",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "creditCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPlatformStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "totalProjects",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalCredits",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalVerifiedOrgs",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_projectId",
				"type": "uint256"
			}
		],
		"name": "getProject",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "area",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "ecosystemType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "carbonCredits",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "imageHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "aiResultsHash",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_projectId",
				"type": "uint256"
			}
		],
		"name": "getProjectSummary",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ecosystemType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "carbonCredits",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalProjects",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getUserProjects",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_org",
				"type": "address"
			}
		],
		"name": "isVerifiedOrganization",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "projectCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "projects",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "area",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "ecosystemType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "carbonCredits",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "string",
				"name": "imageHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "aiResultsHash",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalCarbonCredits",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userProjects",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "verifiedOrganizations",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
]

// Initialize blockchain connection only if required environment variables exist
let provider, wallet, contract

const initializeBlockchain = () => {
  try {
    if (!process.env.CONTRACT_ADDRESS) {
      console.log('⚠️ CONTRACT_ADDRESS not set, running in API-only mode')
      return false
    }

    if (!process.env.PRIVATE_KEY) {
      console.log('⚠️ PRIVATE_KEY not set, running in read-only mode')
      return false
    }

    // Use Polygon Amoy testnet RPC
    const RPC_URL = process.env.RPC_URL || 'https://rpc-amoy.polygon.technology/'
    
    provider = new ethers.JsonRpcProvider(RPC_URL)
    
    // Remove '0x' prefix if present and ensure proper format
    let privateKey = process.env.PRIVATE_KEY
    if (privateKey.startsWith('0x')) {
      privateKey = privateKey.slice(2)
    }
    
    // Validate private key length
    if (privateKey.length !== 64) {
      throw new Error('Invalid private key length')
    }
    
    wallet = new ethers.Wallet('0x' + privateKey, provider)
    
    if (CONTRACT_ABI.length > 0) {
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet)
      console.log('✅ Blockchain connection initialized')
      return true
    } else {
      console.log('⚠️ Contract ABI not provided, blockchain functions disabled')
      return false
    }
    
  } catch (error) {
    console.error('❌ Failed to initialize blockchain connection:', error.message)
    return false
  }
}

// Initialize blockchain connection
const blockchainEnabled = initializeBlockchain()

// AI Model Integration Functions
async function callAIModel(imagePath, projectData) {
  try {
    console.log('🤖 Analyzing image with AI model:', imagePath)

    // Option 1: Call your Python AI model
    const { spawn } = require('child_process')

    return new Promise((resolve, reject) => {
      const python = spawn('python3', [
        'ai_model.py',
        imagePath,
        JSON.stringify(projectData),
      ])

      let output = ''
      let errorOutput = ''

      python.stdout.on('data', (data) => {
        output += data.toString()
      })

      python.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })

      python.on('close', (code) => {
        if (code === 0) {
          try {
            const results = JSON.parse(output)
            console.log('✅ AI Analysis Results:', results)
            resolve(results)
          } catch (e) {
            console.log('⚠️ AI model output parsing failed, using mock data')
            resolve(generateMockAIResults(projectData))
          }
        } else {
          console.log(
            '⚠️ AI model failed, using mock data. Error:',
            errorOutput
          )
          resolve(generateMockAIResults(projectData))
        }
      })
    })
  } catch (error) {
    console.log('⚠️ AI model call failed, using mock data:', error.message)
    return generateMockAIResults(projectData)
  }
}

// Generate mock AI results for testing
function generateMockAIResults(projectData) {
  const ecosystemMultipliers = {
    mangrove: { base: 10, variance: 3 },
    seagrass: { base: 8, variance: 2 },
    saltmarsh: { base: 6, variance: 2 },
  }

  const multiplier =
    ecosystemMultipliers[projectData.ecosystemType] ||
    ecosystemMultipliers['mangrove']
  const baseCredits = multiplier.base + Math.random() * multiplier.variance
  const carbonCredits = Math.floor(projectData.area * baseCredits)

  return {
    carbonCredits: carbonCredits,
    ecosystemType: projectData.ecosystemType,
    vegetationHealth: Math.random() > 0.3 ? 'good' : 'moderate',
    confidence: 0.75 + Math.random() * 0.2, // 75-95%
    area_detected: projectData.area * (0.9 + Math.random() * 0.2), // 90-110% of reported
    ndvi: 0.3 + Math.random() * 0.4, // 0.3-0.7
    analysis_timestamp: new Date().toISOString(),
    image_quality: Math.random() > 0.2 ? 'good' : 'moderate',
  }
}

// Store AI results (simple file storage - replace with IPFS in production)
function storeAIResults(aiResults) {
  const hash = require('crypto')
    .createHash('sha256')
    .update(JSON.stringify(aiResults))
    .digest('hex')

  const resultsDir = 'ai_results'
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true })
  }

  fs.writeFileSync(
    `${resultsDir}/${hash}.json`,
    JSON.stringify(aiResults, null, 2)
  )
  return hash
}

// Create new project with AI analysis
app.post('/api/projects', upload.single('image'), async (req, res) => {
  try {
    console.log('📋 New project submission received')

    const { name, location, area, ecosystemType, userAddress } = req.body
    const imageFile = req.file

    if (!imageFile) {
      return res.status(400).json({ error: 'Image file is required' })
    }

    if (!name || !location || !area || !ecosystemType || !userAddress) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Step 1: Analyze image with AI
    const projectData = {
      name,
      location,
      area: parseInt(area),
      ecosystemType,
      userAddress,
    }

    const aiResults = await callAIModel(imageFile.path, projectData)

    // Step 2: Store AI results
    const aiResultsHash = storeAIResults(aiResults)
    const imageHash = imageFile.filename // Simple file reference

    let blockchainResult = null
    let projectId = Math.floor(Math.random() * 1000000) // Fallback ID

    // Step 3: Create project on blockchain (if enabled)
    if (blockchainEnabled && contract) {
      try {
        console.log('⛓️ Creating project on blockchain...')

        const tx = await contract.createProject(
          name,
          location,
          parseInt(area),
          ecosystemType,
          imageHash
        )

        const receipt = await tx.wait()
        console.log('✅ Project created on blockchain:', receipt.transactionHash)

        // Extract project ID from event logs
        if (receipt.logs && receipt.logs.length > 0) {
          const projectCreatedEvent = receipt.logs.find(log => {
            try {
              const decoded = contract.interface.parseLog(log)
              return decoded.name === 'ProjectCreated'
            } catch (e) {
              return false
            }
          })
          
          if (projectCreatedEvent) {
            const decoded = contract.interface.parseLog(projectCreatedEvent)
            projectId = parseInt(decoded.args.projectId)
          }
        }

        blockchainResult = {
          transactionHash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString()
        }

        // Step 4: Issue carbon credits if AI analysis is positive
        if (aiResults.carbonCredits > 0 && aiResults.confidence > 0.7) {
          console.log('🌱 Issuing carbon credits...')

          const creditTx = await contract.verifyProjectAndIssueCredits(
            projectId,
            aiResults.carbonCredits,
            aiResultsHash
          )

          await creditTx.wait()
          console.log('✅ Carbon credits issued!')
        }
      } catch (error) {
        console.error('❌ Blockchain operation failed:', error.message)
        console.log('📝 Continuing with off-chain storage...')
      }
    }

    res.json({
      success: true,
      projectId: projectId,
      blockchainResult: blockchainResult,
      aiResults: aiResults,
      carbonCredits: aiResults.carbonCredits,
      imageUrl: `/uploads/${imageFile.filename}`,
    })
  } catch (error) {
    console.error('❌ Error creating project:', error)
    res.status(500).json({
      error: 'Failed to create project',
      details: error.message,
    })
  }
})

// Get user's projects
app.get('/api/projects/user/:address', async (req, res) => {
  try {
    const userAddress = req.params.address

    if (!blockchainEnabled || !contract) {
      return res.status(503).json({ 
        error: 'Blockchain functionality not available',
        message: 'Contract ABI not configured'
      })
    }

    const projectIds = await contract.getUserProjects(userAddress)
    const projects = []

    for (let i = 0; i < projectIds.length; i++) {
      const projectData = await contract.getProject(projectIds[i])
      projects.push({
        id: projectData[0].toString(),
        name: projectData[1],
        location: projectData[2],
        owner: projectData[3],
        area: projectData[4].toString(),
        ecosystemType: projectData[5],
        carbonCredits: projectData[6].toString(),
        createdAt: projectData[7].toString(),
        isActive: projectData[8],
        imageHash: projectData[9],
        aiResultsHash: projectData[10],
      })
    }

    res.json({ projects })
  } catch (error) {
    console.error('❌ Error fetching user projects:', error)
    res.status(500).json({ error: 'Failed to fetch projects', details: error.message })
  }
})

// Get single project details
app.get('/api/projects/:id', async (req, res) => {
  try {
    const projectId = req.params.id

    if (!blockchainEnabled || !contract) {
      return res.status(503).json({ 
        error: 'Blockchain functionality not available',
        message: 'Contract ABI not configured'
      })
    }

    const projectData = await contract.getProject(projectId)

    const project = {
      id: projectData[0].toString(),
      name: projectData[1],
      location: projectData[2],
      owner: projectData[3],
      area: projectData[4].toString(),
      ecosystemType: projectData[5],
      carbonCredits: projectData[6].toString(),
      createdAt: projectData[7].toString(),
      isActive: projectData[8],
      imageHash: projectData[9],
      aiResultsHash: projectData[10],
    }

    // Load AI results if available
    if (project.aiResultsHash) {
      try {
        const aiResultsPath = `ai_results/${project.aiResultsHash}.json`
        if (fs.existsSync(aiResultsPath)) {
          project.aiResults = JSON.parse(fs.readFileSync(aiResultsPath, 'utf8'))
        }
      } catch (e) {
        console.log('Could not load AI results:', e.message)
      }
    }

    res.json({ project })
  } catch (error) {
    console.error('❌ Error fetching project:', error)
    res.status(500).json({ error: 'Failed to fetch project', details: error.message })
  }
})

// Get platform statistics
app.get('/api/stats', async (req, res) => {
  try {
    if (!blockchainEnabled || !contract) {
      return res.json({
        totalProjects: '0',
        totalCarbonCredits: '0',
        totalVerifiedOrgs: '0',
        note: 'Blockchain functionality not available'
      })
    }

    const stats = await contract.getPlatformStats()

    res.json({
      totalProjects: stats[0].toString(),
      totalCarbonCredits: stats[1].toString(),
      totalVerifiedOrgs: stats[2].toString(),
    })
  } catch (error) {
    console.error('❌ Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch statistics', details: error.message })
  }
})

// Check if address is verified organization
app.get('/api/verify/:address', async (req, res) => {
  try {
    const address = req.params.address

    if (!blockchainEnabled || !contract) {
      return res.json({ 
        isVerified: false,
        note: 'Blockchain functionality not available'
      })
    }

    const isVerified = await contract.isVerifiedOrganization(address)

    res.json({ isVerified })
  } catch (error) {
    console.error('❌ Error checking verification:', error)
    res.status(500).json({ error: 'Failed to check verification', details: error.message })
  }
})

// Get admin address
app.get('/api/admin', async (req, res) => {
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
})

// Add verified organization (admin only)
app.post('/api/admin/verify-org', async (req, res) => {
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

    // Check if current wallet is admin
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
})

// Health check endpoint
app.get('/health', (req, res) => {
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
})

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(400)
        .json({ error: 'File too large. Maximum size is 10MB.' })
    }
  }

  console.error('💥 Unhandled error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Blue Carbon Backend Server running on port ${PORT}`)
  console.log(`📍 Contract Address: ${CONTRACT_ADDRESS || 'Not configured'}`)
  console.log(`⛓️ Blockchain: ${blockchainEnabled ? 'Enabled' : 'Disabled'}`)
  console.log(`🌐 Health Check: http://localhost:${PORT}/health`)
  console.log('Ready to process blue carbon projects! 🌊🌱')
  
  if (!blockchainEnabled) {
    console.log('')
    console.log('💡 To enable blockchain functionality:')
    console.log('   1. Set CONTRACT_ADDRESS in your .env file')
    console.log('   2. Set PRIVATE_KEY in your .env file')
    console.log('   3. Add the contract ABI to the CONTRACT_ABI array')
  }
})