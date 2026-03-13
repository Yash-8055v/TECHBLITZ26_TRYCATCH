const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const patientController = require('../controllers/patientController');

// All patient routes require authentication
router.use(verifyToken);

// POST /api/patients
router.post('/', patientController.createPatient);

module.exports = router;
