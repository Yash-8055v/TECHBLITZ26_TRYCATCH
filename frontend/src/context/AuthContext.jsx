// @refresh reset
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

// ── Demo accounts (no Firebase needed) ──────────────────────────────────────
const DEMO_ACCOUNTS = {
  'receptionist@demo.com': {
    password: 'demo123',
    profile: { id: 'demo-r', name: 'Alex Rivera', role: 'receptionist', email: 'receptionist@demo.com' },
  },
  'doctor@demo.com': {
    password: 'demo123',
    profile: { id: 'demo-d', name: 'Dr. Sarah Mitchell', role: 'doctor', email: 'doctor@demo.com' },
  },
};

export const AuthProvider = ({ children }) => {
  const [user,        setUser]        = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading,     setLoading]     = useState(true);

  // Restore demo session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cf_demo_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setUserProfile(parsed.profile);
      setLoading(false);
      return;
    }

    // Real Firebase listener
    let unsubFirebase;
    // Safety net: if Firebase never calls back (misconfigured), stop loading after 5s
    const safetyTimeout = setTimeout(() => setLoading(false), 5000);
    try {
      unsubFirebase = onAuthStateChanged(auth, async (fbUser) => {
        clearTimeout(safetyTimeout);
        if (fbUser) {
          setUser(fbUser);
          try {
            const snap = await getDoc(doc(db, 'users', fbUser.uid));
            if (snap.exists()) setUserProfile({ id: snap.id, ...snap.data() });
            else setUserProfile({ id: fbUser.uid, name: fbUser.email, role: 'receptionist', email: fbUser.email });
          } catch (e) { console.warn('Profile fetch failed:', e); }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      });
    } catch {
      clearTimeout(safetyTimeout);
      setLoading(false);
    }
    return () => { unsubFirebase?.(); clearTimeout(safetyTimeout); };
  }, []);

  const login = async (email, password) => {
    // Check demo accounts first
    const demo = DEMO_ACCOUNTS[email.toLowerCase()];
    if (demo && demo.password === password) {
      const mockUser = { uid: demo.profile.id, email, isDemo: true, profile: demo.profile };
      localStorage.setItem('cf_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setUserProfile(demo.profile);
      return mockUser;
    }
    // Real Firebase login
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    localStorage.removeItem('cf_demo_user');
    try { await signOut(auth); } catch {}
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user, userProfile, loading, login, logout,
      isAuthenticated:  !!user,
      isDoctor:         userProfile?.role === 'doctor',
      isReceptionist:   userProfile?.role === 'receptionist',
      role:             userProfile?.role,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
