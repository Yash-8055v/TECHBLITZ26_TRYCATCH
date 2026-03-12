import { WEBHOOK_BASE_URL } from '../config/constants';

/**
 * Fire-and-forget webhook to n8n. Never throws — errors only logged.
 * @param {string} event  e.g. "patient.created"
 * @param {object} data   payload for n8n
 */
export const triggerWebhook = async (event, data) => {
  try {
    await fetch(`${WEBHOOK_BASE_URL}/${event}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ event, timestamp: new Date().toISOString(), data }),
    });
  } catch (err) {
    console.warn(`[Webhook] ${event} failed:`, err.message);
  }
};
