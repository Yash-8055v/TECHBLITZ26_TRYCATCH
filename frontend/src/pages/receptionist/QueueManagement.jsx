import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
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

const QueueManagement = () => {
  const [queue,  setQueue]  = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'queue'), orderBy('token', 'asc'));
    return onSnapshot(q, snap => setQueue(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, 'queue', id), { status });
  };

  const tabs = ['All', QUEUE_STATUS.WAITING, QUEUE_STATUS.IN_PROGRESS, QUEUE_STATUS.COMPLETED, QUEUE_STATUS.SKIPPED];

  const filtered = queue.filter(p => {
    const matchTab = filter === 'All' || p.status === filter;
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || String(p.token) === search;
    return matchTab && matchSearch;
  });

  const waiting     = queue.filter(q => q.status === QUEUE_STATUS.WAITING).length;
  const inProgress  = queue.filter(q => q.status === QUEUE_STATUS.IN_PROGRESS).length;
  const completed   = queue.filter(q => q.status === QUEUE_STATUS.COMPLETED).length;

  const callNext = async () => {
    const nextWaiting = queue.find(q => q.status === QUEUE_STATUS.WAITING);
    if (!nextWaiting) return;
    const current = queue.find(q => q.status === QUEUE_STATUS.IN_PROGRESS);
    if (current) await updateStatus(current.id, QUEUE_STATUS.COMPLETED);
    await updateStatus(nextWaiting.id, QUEUE_STATUS.IN_PROGRESS);
  };

  const currentPatient = queue.find(q => q.status === QUEUE_STATUS.IN_PROGRESS);

  return (
    <div className="p-8 font-display">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">group</span>
            Live Queue Management
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="size-2 bg-emerald-500 rounded-full animate-pulse-dot" />
            <p className="text-slate-500 text-sm">Real-time • Auto-updating every 30 seconds</p>
          </div>
        </div>
        <button
          onClick={callNext}
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-6 rounded-lg transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          disabled={waiting === 0}
        >
          <span className="material-symbols-outlined text-lg">record_voice_over</span>
          Call Next Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Waiting', value: waiting,    color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'In Progress', value: inProgress, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', value: completed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-5 border border-slate-200`}>
            <p className="text-slate-500 text-sm font-medium">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Current patient highlight */}
      {currentPatient && (
        <div className="bg-primary rounded-xl p-5 text-white mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs opacity-70 uppercase font-bold tracking-widest mb-1">Now Serving</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black">{currentPatient.token}</span>
              <div>
                <p className="font-bold text-lg">{currentPatient.name}</p>
                <p className="text-sm opacity-80">{currentPatient.symptoms || 'No symptoms noted'}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => updateStatus(currentPatient.id, QUEUE_STATUS.COMPLETED)}
            className="bg-white text-primary font-bold px-5 py-2.5 rounded-lg hover:bg-primary/10 transition-all"
          >
            Mark Complete ✓
          </button>
        </div>
      )}

      {/* Filters + Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Tabs */}
          <div className="flex gap-1 flex-wrap">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filter === t ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search patient or token..."
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Token</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Symptoms</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No patients match the current filter.
                  </td>
                </tr>
              ) : filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`font-bold ${item.status === QUEUE_STATUS.IN_PROGRESS ? 'text-primary text-lg' : 'text-slate-500'}`}>
                      {item.token}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeColors[item.type] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm max-w-[180px] truncate">{item.symptoms || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[item.status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {item.status === QUEUE_STATUS.WAITING && (
                      <>
                        <button
                          onClick={() => updateStatus(item.id, QUEUE_STATUS.IN_PROGRESS)}
                          className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-all"
                        >
                          Call
                        </button>
                        <button
                          onClick={() => updateStatus(item.id, QUEUE_STATUS.SKIPPED)}
                          className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-all"
                        >
                          Skip
                        </button>
                      </>
                    )}
                    {item.status === QUEUE_STATUS.IN_PROGRESS && (
                      <button
                        onClick={() => updateStatus(item.id, QUEUE_STATUS.COMPLETED)}
                        className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-all"
                      >
                        Complete
                      </button>
                    )}
                    {(item.status === QUEUE_STATUS.COMPLETED || item.status === QUEUE_STATUS.SKIPPED) && (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-500">Showing {filtered.length} of {queue.length} patients</p>
        </div>
      </div>
    </div>
  );
};

export default QueueManagement;
