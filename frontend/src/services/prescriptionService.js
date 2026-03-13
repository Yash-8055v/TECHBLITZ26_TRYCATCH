import {
  collection, query, orderBy, onSnapshot, where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { apiFetch } from './apiService';

const COL = 'prescriptions';

/**
 * Save a new prescription via backend API.
 * @param {{
 *   patientName, patientId, queueId,
 *   diagnosis, notes,
 *   medicines: [{ name, dosage, frequency, duration }]
 *   doctorId, doctorName
 * }} data
 * @returns {string} document ID
 */
export const savePrescription = async (data) => {
  const result = await apiFetch('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.id;
};

/**
 * Subscribe to all prescriptions, newest first.
 */
export const subscribePrescriptions = (callback) => {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

/**
 * Subscribe to prescriptions for a specific patient.
 */
export const subscribePrescriptionsByPatient = (patientId, callback) => {
  const q = query(
    collection(db, COL),
    where('patientId', '==', patientId),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

/**
 * Subscribe to today's prescriptions.
 */
export const subscribeTodayPrescriptions = (doctorId, callback) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const q = query(
    collection(db, COL),
    where('doctorId', '==', doctorId),
    orderBy('createdAt', 'desc'),
  );
  return onSnapshot(q, (snap) => {
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const todayItems = all.filter((rx) => {
      const ts = rx.createdAt?.toDate?.();
      return ts && ts >= today;
    });
    callback(todayItems);
  });
};
