const express = require('express')
const { createProject, getUserProjects, getProject, getStats, verifyAddress } = require('../controllers/projectController')

const router = express.Router()

module.exports = (upload) => {
  router.post('/', upload.single('image'), createProject)
  router.get('/user/:address', getUserProjects)
  router.get('/stats', getStats)
  router.get('/verify/:address', verifyAddress)
  router.get('/:id', getProject)

  return router
}