import {
  collection, query, orderBy, onSnapshot, where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { QUEUE_STATUS } from '../config/constants';
import { apiFetch } from './apiService';

const COL = 'queue';

/**
 * Add a walk-in patient to the queue via backend.
 * @param {{ name, phone, symptoms }} data
 * @returns {{ id: string, token: number }}
 */
export const addWalkIn = async (data) => {
  const result = await apiFetch('/queue/walk-in', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return { id: result.id, token: result.token };
};

/**
 * Add an appointment patient to the queue via backend.
 */
export const addAppointmentToQueue = async (data) => {
  const result = await apiFetch('/queue/appointment', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return { id: result.id, token: result.token };
};

/**
 * Update the status of a queue entry via backend.
 * @param {string} id
 * @param {string} status  one of QUEUE_STATUS values
 */
export const updateQueueStatus = async (id, status) => {
  await apiFetch(`/queue/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

/**
 * Call the next waiting patient. Completes current in-progress (if any).
 * @param {Array} currentQueue  the live queue array
 */
export const callNextPatient = async (currentQueue) => {
  const nextWaiting = currentQueue.find((q) => q.status === QUEUE_STATUS.WAITING);
  if (!nextWaiting) return null;
  const current = currentQueue.find((q) => q.status === QUEUE_STATUS.IN_PROGRESS);
  if (current) await updateQueueStatus(current.id, QUEUE_STATUS.COMPLETED);
  await updateQueueStatus(nextWaiting.id, QUEUE_STATUS.IN_PROGRESS);
  return nextWaiting;
};

/**
 * Subscribe to the full queue in real-time, ordered by token.
 */
export const subscribeQueue = (callback) => {
  const q = query(collection(db, COL), orderBy('token', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

/**
 * Subscribe to only active (waiting + in-progress) queue entries.
 */
export const subscribeActiveQueue = (callback) => {
  const q = query(
    collection(db, COL),
    where('status', 'in', [QUEUE_STATUS.WAITING, QUEUE_STATUS.IN_PROGRESS]),
    orderBy('token', 'asc'),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};
