const { db } = require('../config/firebase');

exports.createPatient = async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not configured.' });

    const { name, phone, age, gender, bloodGroup, address, medicalHistory } = req.body;
    
    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required.' });
    }

    const patientData = {
      name: name.trim(),
      phone: phone.trim(),
      age: age ? parseInt(age, 10) : null,
      gender: gender || null,
      bloodGroup: bloodGroup || null,
      address: address || null,
      medicalHistory: medicalHistory || [],
      createdBy: req.user.uid, // From auth middleware
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toISOString()
    };

    const docRef = await db.collection('patients').add(patientData);
    
    res.status(201).json({ 
      id: docRef.id, 
      message: 'Patient created successfully',
      patient: patientData 
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Internal server error creating patient.' });
  }
};
