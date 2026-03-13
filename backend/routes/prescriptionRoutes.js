const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const prescriptionController = require('../controllers/prescriptionController');

router.use(verifyToken);

// POST /api/prescriptions
router.post('/', prescriptionController.savePrescription);

module.exports = router;
