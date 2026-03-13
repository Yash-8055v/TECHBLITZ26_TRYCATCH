import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { savePrescription } from '../../services/prescriptionService';
import { triggerWebhook } from '../../services/webhookService';

const QUICK_TEMPLATES = [
  { label: 'Common Flu',              diagnosis: 'Acute Viral Upper Respiratory Tract Infection', meds: [{ name: 'Paracetamol 500mg', type: 'Tablet', dosage: '1 unit', freq: 'Every 6 hours (SOS)', duration: '3 days' }, { name: 'Cetirizine 10mg', type: 'Tablet', dosage: '1 unit', freq: 'Once at night', duration: '5 days' }] },
  { label: 'Hypertension',            diagnosis: 'Essential Hypertension — Routine Management',  meds: [{ name: 'Amlodipine 5mg', type: 'Tablet', dosage: '1 unit', freq: 'Once daily morning', duration: '30 days' }] },
  { label: 'Post-Op Recovery',        diagnosis: 'Post-Surgical Recovery — Wound care & rest',   meds: [{ name: 'Amoxicillin 500mg', type: 'Capsule', dosage: '1 unit', freq: '3 times a day', duration: '7 days' }, { name: 'Diclofenac 50mg', type: 'Tablet', dosage: '1 unit', freq: 'Twice daily after food', duration: '5 days' }] },
];

const Prescriptions = () => {
  const { userProfile } = useAuth();
  const [diagnosis,    setDiagnosis]    = useState('');
  const [instructions, setInstructions] = useState('');
  const [isUrgent,     setIsUrgent]     = useState(false);
  const [followUp,     setFollowUp]     = useState(false);
  const [meds, setMeds] = useState([{ name: '', type: 'Tablet', dosage: '', freq: '', duration: '' }]);
  const [patientName,  setPatientName]  = useState('');
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [error,        setError]        = useState('');

  const addMed = () => setMeds(m => [...m, { name: '', type: 'Tablet', dosage: '', freq: '', duration: '' }]);
  const removeMed = (i) => setMeds(m => m.filter((_, idx) => idx !== i));
  const updateMed = (i, field, value) => setMeds(m => m.map((med, idx) => idx === i ? { ...med, [field]: value } : med));

  const applyTemplate = (tpl) => {
    setDiagnosis(tpl.diagnosis);
    setMeds(tpl.meds.map(m => ({ ...m })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim() || !patientName.trim()) { setError('Please fill in patient name and diagnosis.'); return; }
    setLoading(true); setError('');
    try {
      await savePrescription({
        patientName:  patientName.trim(),
        diagnosis:    diagnosis.trim(),
        medications:  meds.filter(m => m.name.trim()),
        instructions,
        isUrgent,
        followUp,
        doctorId:     userProfile?.id || 'unknown',
        doctorName:   userProfile?.name || 'Doctor',
        refNo:        `RX-${Date.now()}`,
      });
      await triggerWebhook('prescription.created', { patientName, diagnosis });
      setSuccess(true);
    } catch (err) {
      setError('Failed to save prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 font-display flex items-center justify-center min-h-[60vh]">
        <div className="text-center animate-fade-in">
          <div className="size-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-emerald-600 text-4xl">task_alt</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Prescription Saved!</h2>
          <p className="text-slate-500 mb-6">Prescription for <strong>{patientName}</strong> has been created.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => window.print()}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined">print</span> Print
            </button>
            <button onClick={() => { setSuccess(false); setDiagnosis(''); setMeds([{ name:'', type:'Tablet', dosage:'', freq:'', duration:'' }]); setPatientName(''); }}
              className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm">
              New Prescription
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 font-display">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Digital Prescription</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase tracking-wider">Doctor</span>
            <p className="text-slate-500 text-sm">Enter patient name and complete the prescription below</p>
          </div>
        </div>
        <div className="text-right text-slate-500 text-sm">
          <p>{new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}</p>
          <p>Ref: RX-{Date.now().toString().slice(-6)}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-red-500">error</span>{error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Patient name */}
        <div className="mb-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
              <span className="material-symbols-outlined text-primary text-[18px]">person</span>
              Patient Name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              required
              placeholder="e.g. Jane Doe"
              className="form-input w-full rounded-lg border border-slate-200 bg-slate-50 h-12 px-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Diagnosis + Medications */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Diagnosis */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">description</span>
                <h3 className="text-slate-900 text-lg font-bold">Clinical Diagnosis</h3>
              </div>
              <textarea
                value={diagnosis}
                onChange={e => setDiagnosis(e.target.value)}
                required
                placeholder="Enter clinical diagnosis, primary symptoms, and observations..."
                rows={4}
                className="form-input flex w-full resize-none rounded-lg text-slate-900 border border-slate-200 bg-slate-50 focus:border-primary focus:ring-1 focus:ring-primary p-4 text-sm"
              />
            </section>

            {/* Medications */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">pill</span>
                  <h3 className="text-slate-900 text-lg font-bold">Medications</h3>
                </div>
                <button type="button" onClick={addMed}
                  className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                  <span className="material-symbols-outlined text-sm">add_circle</span> Add Medicine
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 text-slate-500 text-xs font-bold uppercase tracking-wider min-w-[160px]">Medicine Name</th>
                      <th className="py-3 text-slate-500 text-xs font-bold uppercase tracking-wider">Type</th>
                      <th className="py-3 text-slate-500 text-xs font-bold uppercase tracking-wider">Dosage</th>
                      <th className="py-3 text-slate-500 text-xs font-bold uppercase tracking-wider min-w-[140px]">Frequency</th>
                      <th className="py-3 text-slate-500 text-xs font-bold uppercase tracking-wider">Duration</th>
                      <th className="py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {meds.map((med, i) => (
                      <tr key={i}>
                        <td className="py-3 pr-3">
                          <input type="text" value={med.name} onChange={e => updateMed(i, 'name', e.target.value)}
                            placeholder="e.g. Amoxicillin 500mg"
                            className="form-input w-full rounded-lg border border-slate-200 bg-slate-50 h-10 px-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
                        </td>
                        <td className="py-3 pr-3">
                          <select value={med.type} onChange={e => updateMed(i, 'type', e.target.value)}
                            className="form-input w-full rounded-lg border border-slate-200 bg-slate-50 h-10 px-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary">
                            {['Tablet','Capsule','Syrup','Injection','Cream','Drops'].map(t => <option key={t}>{t}</option>)}
                          </select>
                        </td>
                        <td className="py-3 pr-3">
                          <input type="text" value={med.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)}
                            placeholder="1 unit"
                            className="form-input w-full rounded-lg border border-slate-200 bg-slate-50 h-10 px-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
                        </td>
                        <td className="py-3 pr-3">
                          <input type="text" value={med.freq} onChange={e => updateMed(i, 'freq', e.target.value)}
                            placeholder="3 times a day"
                            className="form-input w-full rounded-lg border border-slate-200 bg-slate-50 h-10 px-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
                        </td>
                        <td className="py-3 pr-3">
                          <input type="text" value={med.duration} onChange={e => updateMed(i, 'duration', e.target.value)}
                            placeholder="7 days"
                            className="form-input w-full rounded-lg border border-slate-200 bg-slate-50 h-10 px-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary" />
                        </td>
                        <td className="py-3">
                          <button type="button" onClick={() => removeMed(i)}
                            className="text-slate-400 hover:text-red-500 transition-colors" disabled={meds.length === 1}>
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={addMed}
                className="mt-4 w-full p-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 hover:text-primary hover:border-primary/40 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                <span className="material-symbols-outlined text-xl">add</span>
                Click to add next medication
              </button>
            </section>
          </div>

          {/* Right: Instructions + Actions */}
          <div className="flex flex-col gap-6">
            {/* Instructions */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">assignment</span>
                <h3 className="text-slate-900 text-lg font-bold">Instructions</h3>
              </div>
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="Food restrictions, follow-up date, or general advice..."
                rows={5}
                className="form-input flex w-full resize-none rounded-lg text-slate-900 border border-slate-200 bg-slate-50 focus:border-primary focus:ring-1 focus:ring-primary p-4 text-sm"
              />
              <div className="mt-4 flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-slate-600">Mark as Urgent</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={followUp} onChange={e => setFollowUp(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-sm text-slate-600">Request Follow-up in 1 week</span>
                </label>
              </div>
            </section>

            {/* Actions */}
            <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
              <button type="submit" disabled={loading}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                <span className="material-symbols-outlined">send</span>
                {loading ? 'Saving...' : 'Save & Send to Pharmacy'}
              </button>
              <button type="button" onClick={() => window.print()}
                className="w-full bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">print</span>
                Print Prescription
              </button>
              <hr className="border-slate-100" />
              <button type="button"
                className="w-full bg-transparent text-slate-500 font-medium py-2 px-4 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">save</span>
                Save as Draft
              </button>
            </section>

            {/* Quick Templates */}
            <section className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Quick Templates</h4>
              <div className="flex flex-wrap gap-2">
                {QUICK_TEMPLATES.map(tpl => (
                  <button key={tpl.label} type="button" onClick={() => applyTemplate(tpl)}
                    className="px-3 py-1 bg-white text-slate-600 text-xs font-medium rounded-full border border-slate-200 cursor-pointer hover:border-primary hover:text-primary transition-colors">
                    {tpl.label}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            System Online
          </span>
          <span>Version 1.0.0</span>
        </div>
        <span>Auto-saves every minute</span>
      </div>
    </div>
  );
};

export default Prescriptions;
