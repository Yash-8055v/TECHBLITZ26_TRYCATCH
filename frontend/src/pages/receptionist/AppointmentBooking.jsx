import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { APPT_STATUS } from '../../config/constants';
import { triggerWebhook } from '../../services/webhookService';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const timeSlots = [
  '09:00 AM','09:15 AM','09:30 AM','09:45 AM','10:00 AM','10:15 AM','10:30 AM',
  '10:45 AM','11:00 AM','11:15 AM','05:00 PM','05:15 PM','05:30 PM','05:45 PM',
  '06:00 PM','06:15 PM','06:30 PM','06:45 PM','07:00 PM',
];
const bookedSlots = ['09:15 AM', '05:45 PM', '10:45 AM'];

const AppointmentBooking = () => {
  const today = new Date();
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay,  setSelectedDay]  = useState(today.getDate());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', reason: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay    = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentYear(y => y - 1); setCurrentMonth(11); }
    else setCurrentMonth(m => m - 1);
    setSelectedDay(null);
    setSelectedSlot('');
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentYear(y => y + 1); setCurrentMonth(0); }
    else setCurrentMonth(m => m + 1);
    setSelectedDay(null);
    setSelectedSlot('');
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDay || !selectedSlot || !form.name || !form.phone) {
      setError('Please fill all required fields and select a date & time slot.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      await addDoc(collection(db, 'appointments'), {
        patientName: form.name,
        phone:       form.phone,
        reason:      form.reason,
        date,
        time:        selectedSlot,
        status:      APPT_STATUS.SCHEDULED,
        createdAt:   serverTimestamp(),
      });
      await triggerWebhook('appointment.booked', {
        patientName: form.name,
        phone:       form.phone,
        date,
        time:        selectedSlot,
      });
      setSuccess(true);
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 font-display flex items-center justify-center min-h-[60vh]">
        <div className="text-center animate-fade-in">
          <div className="size-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-emerald-600 text-4xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Appointment Booked!</h2>
          <p className="text-slate-500 mb-6">
            {form.name} • {`${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(selectedDay).padStart(2,'0')}`} • {selectedSlot}
          </p>
          <button onClick={() => { setSuccess(false); setForm({ name:'', phone:'', reason:'' }); setSelectedSlot(''); }}
            className="bg-primary text-white font-bold py-2.5 px-8 rounded-lg hover:bg-primary-dark transition-all">
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 font-display">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Schedule Appointment</h2>
          <p className="text-slate-500">Select a date and available time slot</p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">add</span>
          New Booking
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-red-500">error</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Calendar */}
        <div className="xl:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <h3 className="text-lg font-bold">{MONTHS[currentMonth]} {currentYear}</h3>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-7 text-center mb-2">
            {DAYS.map(d => <span key={d} className="text-xs font-bold text-slate-400">{d[0]}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="h-10" />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isSelected = day === selectedDay;
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              return (
                <button
                  key={day}
                  disabled={isPast}
                  onClick={() => { setSelectedDay(day); setSelectedSlot(''); }}
                  className={`h-10 w-full flex items-center justify-center rounded-lg text-sm font-medium transition-all
                    ${isSelected  ? 'bg-primary text-white font-bold shadow-md shadow-primary/30' :
                      isToday     ? 'border-2 border-primary text-primary font-bold' :
                      isPast      ? 'text-slate-300 cursor-not-allowed' :
                                   'hover:bg-slate-100'}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots + form */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">
                {selectedDay
                  ? `Available Slots — ${selectedDay} ${MONTHS[currentMonth]}`
                  : 'Select a date to see slots'}
              </h3>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded bg-primary/20 border border-primary/30" />
                  <span className="text-slate-500">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded bg-slate-100 border border-slate-200" />
                  <span className="text-slate-500">Booked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded bg-primary border-primary/30" />
                  <span className="text-slate-500">Selected</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {timeSlots.map(slot => {
                const isBooked   = bookedSlots.includes(slot);
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    disabled={isBooked || !selectedDay}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 text-center rounded-lg text-sm font-bold transition-all ${
                      isSelected ? 'bg-primary text-white border-2 border-primary shadow-md' :
                      isBooked   ? 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200' :
                      !selectedDay ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-200' :
                                   'border border-primary/30 bg-primary/5 hover:bg-primary hover:text-white'
                    }`}
                  >
                    {slot}
                    {isBooked && <span className="block text-[9px] uppercase font-bold tracking-tighter opacity-60">Reserved</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Patient form */}
          <form onSubmit={handleBook} className="bg-primary/5 border border-primary/20 rounded-xl p-6">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              Patient Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} required placeholder="Patient name"
                  className="form-input w-full rounded-lg border border-slate-200 bg-white h-11 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-1">Phone <span className="text-red-500">*</span></label>
                <input type="tel" value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} required placeholder="+91 XXXXX XXXXX"
                  className="form-input w-full rounded-lg border border-slate-200 bg-white h-11 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm font-semibold text-slate-700 block mb-1">Reason for Visit</label>
              <input type="text" value={form.reason} onChange={e => setForm(p=>({...p,reason:e.target.value}))} placeholder="e.g. Follow-up, BP Check, Fever..."
                className="form-input w-full rounded-lg border border-slate-200 bg-white h-11 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setForm({name:'',phone:'',reason:''}); setSelectedSlot(''); }}
                className="px-6 py-2 border border-slate-200 rounded-lg font-bold text-sm bg-white hover:bg-slate-50 transition-colors">
                Clear
              </button>
              <button type="submit" disabled={loading || !selectedDay || !selectedSlot}
                className="px-8 py-2 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
