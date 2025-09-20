const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const projectRoutes = require('./routes/projectRoutes')
const adminRoutes = require('./routes/adminRoutes')
const healthRoutes = require('./routes/healthRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

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
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  },
})

// Routes
app.use('/api/projects', projectRoutes(upload))
app.use('/api/admin', adminRoutes)
app.use('/', healthRoutes)
app.use('/api', healthRoutes)

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
  console.log(`📍 Contract Address: ${process.env.CONTRACT_ADDRESS || 'Not configured'}`)
  console.log(`⛓️ Blockchain: ${require('./models/blockchainModel').blockchainEnabled ? 'Enabled' : 'Disabled'}`)
  console.log(`🌐 Health Check: http://localhost:${PORT}/health`)
  console.log('Ready to process blue carbon projects! 🌊🌱')
  
  if (!require('./models/blockchainModel').blockchainEnabled) {
    console.log('')
    console.log('💡 To enable blockchain functionality:')
    console.log('   1. Set CONTRACT_ADDRESS in your .env file')
    console.log('   2. Set PRIVATE_KEY in your .env file')
    console.log('   3. Add the contract ABI to the CONTRACT_ABI array')
  }
})