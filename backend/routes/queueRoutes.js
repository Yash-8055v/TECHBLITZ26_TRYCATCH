const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const queueController = require('../controllers/queueController');

router.use(verifyToken);

// POST /api/queue/walk-in
router.post('/walk-in', queueController.addWalkIn);

// POST /api/queue/appointment
router.post('/appointment', queueController.addAppointmentToQueue);

// PATCH /api/queue/:id/status
router.patch('/:id/status', queueController.updateQueueStatus);

module.exports = router;
