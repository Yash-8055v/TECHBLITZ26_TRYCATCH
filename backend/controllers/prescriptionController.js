const { db, admin } = require('../config/firebase');

exports.savePrescription = async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not configured.' });
    const { patientName, patientId, queueId, diagnosis, notes, medications, instructions, isUrgent, followUp, doctorName } = req.body;
    
    if (!patientName || !diagnosis) {
      return res.status(400).json({ error: 'Patient name and diagnosis are required.' });
    }

    const prescriptionData = {
      patientName: patientName.trim(),
      patientId: patientId || null,
      queueId: queueId || null,
      diagnosis: diagnosis.trim(),
      medications: medications || [],
      notes: notes || '',
      instructions: instructions || '',
      isUrgent: !!isUrgent,
      followUp: !!followUp,
      doctorId: req.user.uid, // Always take doctor ID from the verified token
      doctorName: doctorName || 'Unknown Doctor',
      refNo: `RX-${Date.now()}`,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('prescriptions').add(prescriptionData);
    
    res.status(201).json({ 
      id: docRef.id, 
      refNo: prescriptionData.refNo,
      message: 'Prescription saved successfully'
    });
  } catch (error) {
    console.error('Error saving prescription:', error);
    res.status(500).json({ error: 'Internal server error saving prescription.' });
  }
};
