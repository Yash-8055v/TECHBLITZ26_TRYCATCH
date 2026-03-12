export const WEBHOOK_BASE_URL = import.meta.env.VITE_WEBHOOK_BASE_URL || 'http://localhost:5678/webhook';

export const ROLES = {
  DOCTOR:       'doctor',
  RECEPTIONIST: 'receptionist',
};

export const QUEUE_STATUS = {
  WAITING:     'Waiting',
  IN_PROGRESS: 'In Progress',
  COMPLETED:   'Completed',
  SKIPPED:     'Skipped',
  CANCELLED:   'Cancelled',
};

export const PATIENT_TYPE = {
  WALK_IN:     'Walk-in',
  APPOINTMENT: 'Appointment',
  QR:          'QR',
};

export const APPT_STATUS = {
  SCHEDULED:   'Scheduled',
  COMPLETED:   'Completed',
  CANCELLED:   'Cancelled',
  RESCHEDULED: 'Rescheduled',
};

export const COMMON_SYMPTOMS = [
  'Fever', 'Cold/Cough', 'Headache', 'BP Check',
  'Follow-up', 'Body Pain', 'Diabetes Check', 'Other',
];
