import {
  collection, query, orderBy, onSnapshot, where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { apiFetch } from './apiService';

const COL = 'appointments';

/**
 * Book a new appointment via backend API.
 * @param {{ patientName, phone, reason, date, time }} data
 * @returns {string} new document ID
 */
export const bookAppointment = async (data) => {
  const result = await apiFetch('/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.id;
};

/**
 * Update appointment status via backend API.
 */
export const updateAppointmentStatus = async (id, status) => {
  await apiFetch(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

/**
 * Subscribe to appointments for a specific date.
 */
export const subscribeAppointmentsByDate = (date, callback) => {
  const q = query(
    collection(db, COL),
    where('date', '==', date),
    orderBy('time', 'asc'),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

/**
 * Subscribe to all appointments ordered by date then time.
 */
export const subscribeAllAppointments = (callback) => {
  const q = query(collection(db, COL), orderBy('date', 'asc'), orderBy('time', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};
