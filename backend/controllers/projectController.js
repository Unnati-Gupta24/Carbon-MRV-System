const fs = require('fs')
const { contract, blockchainEnabled } = require('../models/blockchainModel')
const { callAIModel, storeAIResults } = require('../models/aiModel')

const createProject = async (req, res) => {
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

    const projectData = {
      name,
      location,
      area: parseInt(area),
      ecosystemType,
      userAddress,
    }

    const aiResults = await callAIModel(imageFile.path, projectData)

    const aiResultsHash = storeAIResults(aiResults)
    const imageHash = imageFile.filename

    let blockchainResult = null
    let projectId = Math.floor(Math.random() * 1000000) 

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
}

const getUserProjects = async (req, res) => {
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
}

const getProject = async (req, res) => {
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
}

const getStats = async (req, res) => {
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
}

const verifyAddress = async (req, res) => {
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
}

module.exports = {
  createProject,
  getUserProjects,
  getProject,
  getStats,
  verifyAddress
}