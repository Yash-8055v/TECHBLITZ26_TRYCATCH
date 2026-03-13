import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { QUEUE_STATUS, PATIENT_TYPE, COMMON_SYMPTOMS } from '../../config/constants';
import { triggerWebhook } from '../../services/webhookService';

const WalkInRegistration = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', symptoms: '' });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');

  const handleSymptom = (s) => {
    setForm(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s)
        ? prev.symptoms.replace(s, '').replace(/,\s*,/g, ',').trim().replace(/^,|,$/g, '')
        : prev.symptoms ? `${prev.symptoms}, ${s}` : s
    }));
  };

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
        symptoms:  form.symptoms.trim(),
        type:      PATIENT_TYPE.WALK_IN,
        token:     newToken,
        status:    QUEUE_STATUS.WAITING,
        createdAt: serverTimestamp(),
      });
      setToken(newToken);
      // Trigger n8n webhook
      await triggerWebhook('patient.created', {
        name:  form.name.trim(),
        phone: form.phone.trim(),
        token: newToken,
      });
    } catch (err) {
      setError('Failed to register patient. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (token) {
    return (
      <div className="p-8 font-display max-w-[960px] mx-auto">
        <button onClick={() => { setToken(null); setForm({ name: '', phone: '', symptoms: '' }); }}
          className="flex items-center gap-2 text-slate-600 hover:text-primary mb-8 text-sm font-medium transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Register another patient
        </button>
        <div className="bg-primary/5 border-2 border-dashed border-primary rounded-xl p-12 flex flex-col items-center text-center gap-6 animate-fade-in">
          <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Token Generated ✓
          </div>
          <div className="flex flex-col items-center">
            <span className="text-slate-500 text-sm font-medium">Patient Token Number</span>
            <span className="text-primary text-8xl font-black">{token}</span>
          </div>
          <div className="w-full h-px bg-primary/20" />
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">schedule</span>
            <span className="text-slate-900 text-lg font-semibold">Please wait — we'll call your token</span>
          </div>
          <p className="text-slate-500 text-sm italic">Patient will receive SMS notification when it's their turn.</p>
          <button
            onClick={() => navigate('/app/queue')}
            className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-all"
          >
            View Queue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-display">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/10 px-8 py-4 bg-white">
        <div className="flex items-center gap-4 text-primary">
          <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined text-primary text-2xl">medical_services</span>
          </div>
          <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">Walk-in Registration</h2>
        </div>
        <button
          onClick={() => navigate('/app/dashboard')}
          className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Dashboard
        </button>
      </header>

      <main className="py-8 px-8 max-w-[960px] mx-auto">
        <div className="flex flex-col gap-3 mb-8">
          <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">Walk-in Registration</h1>
          <p className="text-slate-600 text-lg">Please enter patient details to generate a queue token.</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-red-500">error</span>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="flex flex-col gap-6 bg-white p-6 rounded-xl border border-primary/10 shadow-sm">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <label className="flex flex-col w-full">
                <span className="text-slate-900 text-base font-medium pb-2">
                  Full Name <span className="text-red-500">*</span>
                </span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="John Doe"
                    className="form-input flex w-full rounded-lg text-slate-900 border border-primary/20 bg-background-light h-14 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400"
                  />
                </div>
              </label>

              {/* Phone */}
              <label className="flex flex-col w-full">
                <span className="text-slate-900 text-base font-medium pb-2">
                  Phone Number <span className="text-red-500">*</span>
                </span>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">call</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    required
                    placeholder="+91 98765 43210"
                    className="form-input flex w-full rounded-lg text-slate-900 border border-primary/20 bg-background-light h-14 pl-11 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400"
                  />
                </div>
              </label>

              {/* Symptoms */}
              <label className="flex flex-col w-full">
                <span className="text-slate-900 text-base font-medium pb-2">Symptoms (Optional)</span>
                <div className="relative">
                  <textarea
                    value={form.symptoms}
                    onChange={e => setForm(p => ({ ...p, symptoms: e.target.value }))}
                    placeholder="Describe how the patient is feeling (e.g. fever, headache)"
                    rows={3}
                    className="form-input flex w-full rounded-lg text-slate-900 border border-primary/20 bg-background-light p-4 focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-slate-400 resize-none"
                  />
                </div>
              </label>

              {/* Common symptoms chips */}
              <div>
                <p className="text-xs text-slate-500 font-medium mb-2">Common symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SYMPTOMS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSymptom(s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        form.symptoms.includes(s)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !form.name.trim() || !form.phone.trim()}
                className="flex w-full items-center justify-center rounded-xl h-16 bg-primary text-white gap-3 text-lg font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                    <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <span className="material-symbols-outlined">confirmation_number</span>
                )}
                <span>{loading ? 'Generating...' : 'Generate Token'}</span>
              </button>
            </form>
          </div>

          {/* Right info card */}
          <div className="flex flex-col gap-6">
            <div className="bg-primary/5 border-2 border-dashed border-primary rounded-xl p-8 flex flex-col items-center text-center gap-4">
              <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                Next Token Preview
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-500 text-sm font-medium">Ready to assign</span>
                <span className="text-primary text-6xl font-black opacity-30">?</span>
              </div>
              <p className="text-slate-500 text-xs italic">
                Token will be automatically assigned after form submission.
              </p>
            </div>
            <div className="bg-white border border-primary/10 rounded-xl p-6 flex flex-col gap-4">
              <h3 className="font-bold text-slate-900">Quick Tips</h3>
              <div className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg text-sm">info</span>
                <p className="text-sm text-slate-600">Patient will receive SMS confirmation once token is generated.</p>
              </div>
              <div className="flex gap-4 items-start">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg text-sm">schedule</span>
                <p className="text-sm text-slate-600">Estimated wait time is shown on the Queue screen.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WalkInRegistration;
