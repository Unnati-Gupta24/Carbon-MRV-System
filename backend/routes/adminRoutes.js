const express = require('express')
const { getAdmin, verifyOrganization } = require('../controllers/adminController')

const router = express.Router()

router.get('/', getAdmin)
router.post('/verify-org', verifyOrganization)

module.exports = router