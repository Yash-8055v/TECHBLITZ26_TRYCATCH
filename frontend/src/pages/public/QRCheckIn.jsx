import { useState } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { QUEUE_STATUS, PATIENT_TYPE } from '../../config/constants';
import { triggerWebhook } from '../../services/webhookService';
import { QRCodeCanvas } from 'qrcode.react';

const QR_SYMPTOMS = [
  { label: 'Fever',       icon: 'thermometer' },
  { label: 'Cold/Cough',  icon: 'air' },
  { label: 'BP Check',    icon: 'monitor_heart' },
  { label: 'Follow-up',   icon: 'event_repeat' },
  { label: 'Headache',    icon: 'psychology' },
  { label: 'Other',       icon: 'more_horiz' },
];

const QRCheckIn = () => {
  const [step,     setStep]     = useState('form'); // form | token
  const [form,     setForm]     = useState({ name: '', phone: '' });
  const [symptoms, setSymptoms] = useState([]);
  const [token,    setToken]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const toggleSymptom = (s) =>
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const getNextToken = async () => {
    const q = query(collection(db, 'queue'), orderBy('token', 'desc'), limit(1));
    const snap = await getDocs(q);
    return snap.empty ? 1 : snap.docs[0].data().token + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setLoading(true);
    setError('');
    try {
      const newToken = await getNextToken();
      await addDoc(collection(db, 'queue'), {
        name:      form.name.trim(),
        phone:     form.phone.trim(),
        symptoms:  symptoms.join(', '),
        type:      PATIENT_TYPE.QR,
        token:     newToken,
        status:    QUEUE_STATUS.WAITING,
        createdAt: serverTimestamp(),
      });
      await triggerWebhook('patient.qr_checkin', {
        name:  form.name.trim(),
        phone: form.phone.trim(),
        token: newToken,
      });
      setToken(newToken);
      setStep('token');
    } catch (err) {
      setError('Check-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'token') {
    return (
      <div className="min-h-screen bg-background-light flex flex-col font-display">
        <header className="bg-white border-b border-primary/10 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary text-2xl">medical_services</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">ClinicFlow</h1>
          </div>
          <div className="bg-emerald-100 px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Checked In!</span>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
          <div className="bg-primary/5 border-2 border-dashed border-primary rounded-2xl p-10 flex flex-col items-center text-center gap-6 max-w-sm w-full">
            <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Your Token
            </div>
            <span className="text-primary text-8xl font-black">{token}</span>
            <div className="w-full h-px bg-primary/20" />
            <div className="bg-white p-4 rounded-xl border border-primary/20">
              <QRCodeCanvas value={`clinicflow-token-${token}`} size={120} />
            </div>
            <p className="text-slate-500 text-sm italic">Please stay in the waiting area. We'll call your number.</p>
          </div>
          <button
            onClick={() => { setStep('form'); setForm({ name:'', phone:'' }); setSymptoms([]); setToken(null); }}
            className="mt-8 text-slate-500 hover:text-primary text-sm font-medium transition-colors"
          >
            ← Check-in another patient
          </button>
        </main>
      </div>
    );
  }

  const nowServing = 11;
  const avgWait    = '~25m';

  return (
    <div className="min-h-screen bg-background-light flex flex-col font-display">
      {/* Header */}
      <header className="bg-white border-b border-primary/10 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary text-2xl">medical_services</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">ClinicFlow</h1>
        </div>
        <div className="bg-primary/10 px-3 py-1 rounded-full">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Open</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 pb-28">
        {/* Live status */}
        <div className="mt-6 bg-primary rounded-xl p-5 text-white shadow-lg shadow-primary/20 flex justify-between items-center">
          <div className="space-y-1 border-r border-white/20 pr-4 flex-1">
            <p className="text-xs opacity-80 uppercase font-medium">Now Serving</p>
            <p className="text-3xl font-bold">{nowServing}</p>
          </div>
          <div className="space-y-1 pl-6">
            <p className="text-xs opacity-80 uppercase font-medium">Avg. Wait Time</p>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">schedule</span>
              <p className="text-xl font-semibold">{avgWait}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Quick Check-In</h2>
            <p className="text-slate-500 text-sm mt-1">Enter your details to join the queue.</p>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 ml-1">Full Name</span>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                </div>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({...p, name: e.target.value}))}
                  required
                  placeholder="John Doe"
                  className="block w-full pl-10 pr-3 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </label>

            {/* Phone */}
            <label className="block">
              <span className="text-sm font-medium text-slate-700 ml-1">Phone Number</span>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 text-sm">call</span>
                </div>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                  required
                  placeholder="+91 98765 43210"
                  className="block w-full pl-10 pr-3 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </label>

            {/* Reason */}
            <div>
              <span className="text-sm font-medium text-slate-700 ml-1">Reason for Visit</span>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {QR_SYMPTOMS.map(s => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => toggleSymptom(s.label)}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                      symptoms.includes(s.label)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-primary/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !form.name || !form.phone}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 text-lg active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>Get My Token</span>
              <span className="material-symbols-outlined">confirmation_number</span>
            </button>
            <p className="text-center text-slate-400 text-xs px-4">
              By checking in, you agree to our Terms of Service. You will receive an SMS when it's your turn.
            </p>
          </form>
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe shadow-2xl z-20">
        <div className="max-w-md mx-auto flex justify-around py-3">
          <a href="#" className="flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-primary">qr_code_scanner</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-tight">Check-in</span>
          </a>
          <a href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">confirmation_number</span>
            <span className="text-[10px] font-medium uppercase tracking-tight">My Tokens</span>
          </a>
          <a href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">info</span>
            <span className="text-[10px] font-medium uppercase tracking-tight">Clinic Info</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default QRCheckIn;
