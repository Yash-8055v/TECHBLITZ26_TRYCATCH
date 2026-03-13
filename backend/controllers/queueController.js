const { db, admin } = require('../config/firebase');

// Constants used for status / type
const QUEUE_STATUS = {
  WAITING: 'waiting',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
};

const PATIENT_TYPE = {
  WALK_IN: 'walk-in',
  APPOINTMENT: 'appointment',
};

// Helper to get the next token number securely using a transaction
// or a simple query for the MVP
const getNextToken = async () => {
  if (!db) throw new Error("Database not configured.");
  const queueRef = db.collection('queue');
  const snapshot = await queueRef.orderBy('token', 'desc').limit(1).get();
  if (snapshot.empty) {
    return 1;
  }
  return snapshot.docs[0].data().token + 1;
};

exports.addWalkIn = async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not configured.' });
    const { name, phone, symptoms } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required.' });
    }

    const token = await getNextToken();

    const queueData = {
      name: name.trim(),
      phone: phone.trim(),
      symptoms: (symptoms || '').trim(),
      type: PATIENT_TYPE.WALK_IN,
      token,
      status: QUEUE_STATUS.WAITING,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      calledAt: null,
      createdBy: req.user.uid
    };

    const docRef = await db.collection('queue').add(queueData);

    res.status(201).json({ 
      id: docRef.id, 
      token,
      message: 'Walk-in added to queue successfully',
    });

  } catch (error) {
    console.error('Error adding walk-in:', error);
    res.status(500).json({ error: 'Internal server error adding to queue.' });
  }
};

exports.addAppointmentToQueue = async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not configured.' });
    const { patientName, phone, reason, appointmentId } = req.body;
    
    if (!patientName || !phone) {
      return res.status(400).json({ error: 'Patient name and phone are required.' });
    }

    const token = await getNextToken();

    const queueData = {
      name: patientName.trim(),
      phone: phone.trim(),
      symptoms: (reason || '').trim(),
      type: PATIENT_TYPE.APPOINTMENT,
      token,
      status: QUEUE_STATUS.WAITING,
      appointmentId: appointmentId || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      calledAt: null,
      createdBy: req.user.uid
    };

    const docRef = await db.collection('queue').add(queueData);

    res.status(201).json({ 
      id: docRef.id, 
      token,
      message: 'Appointment added to queue successfully',
    });

  } catch (error) {
    console.error('Error adding appt to queue:', error);
    res.status(500).json({ error: 'Internal server error adding to queue.' });
  }
};

exports.updateQueueStatus = async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not configured.' });
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(QUEUE_STATUS).includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided.' });
    }

    const extra = {};
    if (status === QUEUE_STATUS.IN_PROGRESS) extra.calledAt = admin.firestore.FieldValue.serverTimestamp();
    if (status === QUEUE_STATUS.COMPLETED)   extra.completedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection('queue').doc(id).update({ 
      status, 
      ...extra,
      updatedBy: req.user.uid 
    });

    res.status(200).json({ message: 'Queue status updated successfully.' });

  } catch (error) {
    console.error('Error updating queue status:', error);
    res.status(500).json({ error: 'Internal server error updating status.' });
  }
};
