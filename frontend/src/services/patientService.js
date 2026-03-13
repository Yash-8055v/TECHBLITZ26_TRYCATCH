import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { apiFetch } from './apiService';

const COL = 'patients';

/**
 * Add a new patient document via backend API.
 * @param {{ name, phone, age, gender, bloodGroup, address, medicalHistory }} data
 * @returns {string} the new document ID
 */
export const addPatient = async (data) => {
  const result = await apiFetch('/patients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.id;
};

/**
 * Subscribe to real-time patient list ordered by name.
 * @param {Function} callback  called with array of patient objects
 * @returns {Function} unsubscribe
 */
export const subscribePatients = (callback) => {
  const q = query(collection(db, COL), orderBy('name', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

/**
 * Fetch patients once (no real-time).
 * @returns {Promise<Array>}
 */
export const fetchPatients = async () => {
  const snap = await getDocs(query(collection(db, COL), orderBy('name', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
