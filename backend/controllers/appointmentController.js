const { db, admin } = require('../config/firebase');

exports.bookAppointment = async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not configured.' });
    const { patientName, phone, reason, date, time } = req.body;
    
    // Validate required fields
    if (!patientName || !phone || !date || !time) {
      return res.status(400).json({ error: 'Patient name, phone, date, and time are required.' });
    }

    const apptData = {
      patientName: patientName.trim(),
      phone: phone.trim(),
      reason: (reason || '').trim(),
      date,
      time,
      status: 'scheduled',
      createdBy: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('appointments').add(apptData);
    
    res.status(201).json({ 
      id: docRef.id, 
      message: 'Appointment booked successfully',
      appointment: apptData 
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Internal server error booking appointment.' });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not configured.' });
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status provided.' });
    }

    await db.collection('appointments').doc(id).update({ 
      status,
      updatedBy: req.user.uid
    });

    res.status(200).json({ message: 'Appointment status updated successfully.' });

  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Internal server error updating appointment status.' });
  }
};
