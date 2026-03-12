import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { QUEUE_STATUS, PATIENT_TYPE } from '../../config/constants';

const statusColors = {
  [QUEUE_STATUS.IN_PROGRESS]: 'bg-blue-100 text-blue-700 border-blue-200',
  [QUEUE_STATUS.WAITING]:     'bg-amber-100 text-amber-700 border-amber-200',
  [QUEUE_STATUS.COMPLETED]:   'bg-emerald-100 text-emerald-700 border-emerald-200',
  [QUEUE_STATUS.SKIPPED]:     'bg-slate-100 text-slate-500 border-slate-200',
};

const typeColors = {
  [PATIENT_TYPE.APPOINTMENT]: 'bg-blue-100 text-blue-700 border-blue-200',
  [PATIENT_TYPE.WALK_IN]:     'bg-purple-100 text-purple-700 border-purple-200',
  [PATIENT_TYPE.QR]:          'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const ReceptionistDashboard = () => {
  const { userProfile } = useAuth();
  const [queue,    setQueue]    = useState([]);
  const [stats,    setStats]    = useState({ appointments: 0, currentToken: 0, waiting: 0 });
  const firstName = userProfile?.name?.split(' ')[0] || 'Alex';

  useEffect(() => {
    // Live queue listener
    const q = query(
      collection(db, 'queue'),
      where('status', 'in', [QUEUE_STATUS.WAITING, QUEUE_STATUS.IN_PROGRESS]),
      orderBy('token', 'asc'),
      limit(10)
    );
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setQueue(items);
      setStats(prev => ({
        ...prev,
        waiting:      items.filter(i => i.status === QUEUE_STATUS.WAITING).length,
        currentToken: items.find(i => i.status === QUEUE_STATUS.IN_PROGRESS)?.token || prev.currentToken,
      }));
    });
    return () => unsub();
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-8 font-display">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Good morning, {firstName}</h2>
          <p className="text-slate-500 mt-0.5">{dateStr}</p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/walk-in"
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Add Walk-in
          </Link>
          <Link
            to="/appointments"
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">event</span>
            Book Appointment
          </Link>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">event_available</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Today's Appointments</p>
            <p className="text-3xl font-bold text-slate-900">{stats.appointments || 15}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="size-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-2xl">confirmation_number</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Current Token</p>
            <p className="text-3xl font-bold text-slate-900">{stats.currentToken || '—'}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="size-12 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined text-2xl">hourglass_empty</span>
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Waiting Patients</p>
            <p className="text-3xl font-bold text-slate-900">{stats.waiting}</p>
          </div>
        </div>
      </div>

      {/* Live Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">dynamic_feed</span>
            Live Queue
          </h3>
          <div className="flex items-center gap-2 text-xs font-medium bg-slate-100 px-2 py-1 rounded">
            <span className="size-2 bg-emerald-500 rounded-full animate-pulse-dot" />
            LIVE UPDATE
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <span className="material-symbols-outlined text-slate-300 text-5xl">group_off</span>
            <p className="text-slate-400 mt-3 font-medium">No patients in queue right now</p>
            <Link to="/walk-in" className="inline-flex items-center gap-2 mt-4 text-primary text-sm font-semibold hover:underline">
              <span className="material-symbols-outlined text-sm">add</span>
              Add a walk-in patient
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Token</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Symptoms</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {queue.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-primary">{item.token}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColors[item.type] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm truncate max-w-[160px]">{item.symptoms || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[item.status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to="/queue"
                        className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-all"
                      >
                        View Queue
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <p className="text-xs text-slate-500">Showing {queue.length} patient{queue.length !== 1 ? 's' : ''} in queue</p>
          <Link to="/queue" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            Manage Queue <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
