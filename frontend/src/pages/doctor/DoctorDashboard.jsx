import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { QUEUE_STATUS } from '../../config/constants';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const { userProfile } = useAuth();
  const [queue, setQueue] = useState([]);
  const firstName = userProfile?.name?.split(' ')[0] || 'Doctor';

  useEffect(() => {
    const q = query(
      collection(db, 'queue'),
      where('status', 'in', [QUEUE_STATUS.WAITING, QUEUE_STATUS.IN_PROGRESS]),
      orderBy('token', 'asc'),
      limit(5)
    );
    return onSnapshot(q, snap => setQueue(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const currentPatient = queue.find(q => q.status === QUEUE_STATUS.IN_PROGRESS);
  const waitingCount   = queue.filter(q => q.status === QUEUE_STATUS.WAITING).length;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-8 font-display">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Good morning, Dr. {firstName}</h2>
          <p className="text-slate-500 mt-0.5">{dateStr}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/app/prescriptions"
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-lg">medication</span>
            New Prescription
          </Link>
        </div>
      </header>

      {/* Current patient highlight */}
      {currentPatient ? (
        <div className="bg-primary rounded-xl p-6 text-white mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs opacity-70 uppercase font-bold tracking-widest mb-1">Now Attending</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black">#{currentPatient.token}</span>
              <div>
                <p className="font-bold text-xl">{currentPatient.name}</p>
                <p className="text-sm opacity-80">{currentPatient.symptoms || 'No symptoms noted'}</p>
                <p className="text-xs opacity-60 mt-0.5">{currentPatient.phone}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/app/prescriptions"
              className="bg-white text-primary font-bold px-5 py-2.5 rounded-lg hover:bg-primary/10 transition-all">
              Prescribe
            </Link>
            <Link to="/app/patients"
              className="bg-white/20 text-white font-bold px-5 py-2.5 rounded-lg hover:bg-white/30 transition-all">
              View Record
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center mb-6">
          <span className="material-symbols-outlined text-slate-300 text-4xl">person_off</span>
          <p className="text-slate-400 mt-2 font-medium">No patient currently being attended</p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Patients Waiting',     value: waitingCount,   icon: 'group',         color: 'text-amber-600',   bg: 'bg-amber-50'   },
          { label: 'Prescriptions Today',  value: '—',             icon: 'medication',    color: 'text-primary',     bg: 'bg-primary/5'  },
          { label: 'Follow-ups Scheduled', value: '—',             icon: 'event_repeat',  color: 'text-purple-600',  bg: 'bg-purple-50'  },
          { label: 'Patients Today',        value: '—',             icon: 'people',        color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className={`size-10 rounded-lg ${s.bg} flex items-center justify-center ${s.color} mb-3`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <p className="text-slate-500 text-xs font-medium">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Today's Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">queue</span>
            Today's Queue
          </h3>
          <Link to="/app/queue" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            Manage <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        </div>

        {queue.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <span className="material-symbols-outlined text-slate-300 text-4xl">inbox</span>
            <p className="text-slate-400 mt-3">Queue is empty. Patients will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {queue.map((item, idx) => (
              <div key={item.id} className={`px-6 py-4 flex items-center gap-4 ${item.status === QUEUE_STATUS.IN_PROGRESS ? 'bg-primary/5' : ''}`}>
                <span className={`text-xl font-black ${item.status === QUEUE_STATUS.IN_PROGRESS ? 'text-primary' : 'text-slate-400'}`}>
                  #{item.token}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.symptoms || 'No symptoms noted'}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  item.status === QUEUE_STATUS.IN_PROGRESS
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}>
                  {item.status === QUEUE_STATUS.IN_PROGRESS ? 'With Doctor' : `Queue #${idx + 1}`}
                </span>
                <Link to="/app/prescriptions"
                  className="text-primary text-sm font-bold hover:underline">
                  Prescribe
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
