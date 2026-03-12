import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';

const PatientRecords = () => {
  const [patients, setPatients] = useState([]);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'patients'), orderBy('name', 'asc'));
    return onSnapshot(q, snap => {
      setPatients(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  const filtered = patients.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.id?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search)
  );

  const samplePatients = [
    { id: 'CF-8821-JD', name: 'Johnathan Doe',   age: 42, gender: 'Male',   phone: '+91 98765 43210', bloodGroup: 'O+', lastVisit: 'Oct 12, 2023', conditions: ['Hypertension', 'Type 2 Diabetes'] },
    { id: 'CF-8820-SJ', name: 'Sarah Johnson',    age: 31, gender: 'Female', phone: '+91 91234 56789', bloodGroup: 'A+', lastVisit: 'Oct 23, 2023', conditions: ['Asthma'] },
    { id: 'CF-8819-MC', name: 'Michael Chen',     age: 55, gender: 'Male',   phone: '+91 99887 76655', bloodGroup: 'B+', lastVisit: 'Sep 05, 2023', conditions: ['Hypertension', 'Arthritis'] },
    { id: 'CF-8818-ED', name: 'Emma Davis',       age: 28, gender: 'Female', phone: '+91 88776 65544', bloodGroup: 'AB-', lastVisit: 'Oct 20, 2023', conditions: [] },
    { id: 'CF-8817-JW', name: 'James Wilson',     age: 66, gender: 'Male',   phone: '+91 90112 23344', bloodGroup: 'O-', lastVisit: 'Oct 15, 2023', conditions: ['Diabetes', 'Sleep Apnea'] },
    { id: 'CF-8816-LT', name: 'Linda Thompson',   age: 45, gender: 'Female', phone: '+91 98234 11234', bloodGroup: 'A-', lastVisit: 'Aug 30, 2023', conditions: ['Thyroid'] },
  ];

  const displayList = (filtered.length === 0 && !search && patients.length === 0) ? samplePatients : filtered;

  return (
    <div className="p-8 font-display">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Patient Records</h2>
          <p className="text-slate-500 mt-0.5">Medical history and patient profiles</p>
        </div>
        <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm hover:bg-primary-dark transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">person_add</span>
          New Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, ID, or phone..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      {/* Patient Cards */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading patients...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayList.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-slate-300 text-5xl">person_search</span>
              <p className="text-slate-400 mt-3">No patients found for "{search}"</p>
            </div>
          ) : displayList.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:border-primary/30 transition-colors">
              {/* Avatar */}
              <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                {p.name?.charAt(0) || '?'}
              </div>
              {/* Info */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Patient</p>
                  <p className="font-bold text-slate-900 mt-0.5">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Demographics</p>
                  <p className="font-medium text-slate-900 mt-0.5 text-sm">{p.gender} • {p.age} yrs</p>
                  <p className="text-xs text-slate-400">Blood: {p.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Last Visit</p>
                  <p className="font-medium text-slate-900 mt-0.5 text-sm">{p.lastVisit}</p>
                  <p className="text-xs text-slate-400">{p.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Conditions</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {(p.conditions || []).length === 0 ?
                      <span className="text-xs text-slate-400">None recorded</span> :
                      p.conditions.slice(0, 2).map(c => (
                        <span key={c} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{c}</span>
                      ))
                    }
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                <button className="px-4 py-2 text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                  View
                </button>
                <button className="px-4 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary-dark rounded-lg transition-colors flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                  Appt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
