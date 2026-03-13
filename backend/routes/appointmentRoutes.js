const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const appointmentController = require('../controllers/appointmentController');

router.use(verifyToken);

// POST /api/appointments
router.post('/', appointmentController.bookAppointment);

// PATCH /api/appointments/:id/status
router.patch('/:id/status', appointmentController.updateAppointmentStatus);

module.exports = router;
