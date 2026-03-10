import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Auth } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncError, setSyncError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setSyncError(null);

            if (firebaseUser) {
                try {
                    const idToken = await firebaseUser.getIdToken();
                    // Sync Firebase user to MongoDB and get the DB role/id
                    const { user: dbUser } = await Auth.syncUser(idToken);

                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: dbUser.name || firebaseUser.displayName || firebaseUser.email,
                        role: dbUser.role,   // 'user' | 'admin' — from MongoDB
                        phone: dbUser.phone || '',
                        id: dbUser.id,       // MongoDB _id — required for booking
                    });
                } catch (err) {
                    console.error('MongoDB sync error:', err.message);
                    // Don't silently fallback — surface the error so user knows data won't save
                    setSyncError(err.message);
                    // Still keep firebase session active but mark as unsynced (no id/role)
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        name: firebaseUser.displayName || firebaseUser.email,
                        role: 'user',
                        id: null,      // null id means MongoDB sync failed — booking will be blocked
                        syncFailed: true,
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await signOut(auth);
        // onAuthStateChanged will set user → null automatically
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, syncError }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
