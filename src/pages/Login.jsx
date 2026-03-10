import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tab, setTab] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '', captcha: false });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // ── Redirect once Firebase + AuthContext resolves the user ─────────────────
    // This handles the race condition: we don't navigate() immediately after
    // signIn; instead we wait for onAuthStateChanged to set the user.
    useEffect(() => {
        if (user) navigate('/', { replace: true });
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.captcha) {
            setError('Please confirm you are not a robot.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            if (tab === 'login') {
                await signInWithEmailAndPassword(auth, form.email, form.password);
            } else {
                const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
                if (form.name) await updateProfile(cred.user, { displayName: form.name });
            }
            // Navigation handled by the useEffect above (waits for onAuthStateChanged)
        } catch (err) {
            const msg = {
                'auth/user-not-found': 'No account found with this email.',
                'auth/wrong-password': 'Incorrect password.',
                'auth/invalid-credential': 'Invalid email or password.',
                'auth/email-already-in-use': 'An account with this email already exists.',
                'auth/weak-password': 'Password should be at least 6 characters.',
                'auth/invalid-email': 'Please enter a valid email address.',
                'auth/too-many-requests': 'Too many attempts. Please try again later.',
            }[err.code] || err.message;
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo">🏥</div>
                    <h1>Hospital Management</h1>
                    <p>{tab === 'login' ? 'Sign in to continue' : 'Create your account'}</p>
                </div>

                {/* Tab switcher */}
                <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0' }}>
                    {[
                        { key: 'login', label: 'Sign In' },
                        { key: 'register', label: 'Register' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => { setTab(key); setError(''); }}
                            style={{
                                flex: 1, padding: '.6rem', border: 'none', background: 'none',
                                cursor: 'pointer', fontWeight: tab === key ? '700' : '400',
                                color: tab === key ? '#2b6cb0' : '#718096',
                                borderBottom: tab === key ? '2px solid #2b6cb0' : 'none',
                                marginBottom: '-2px', fontSize: '.95rem',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {tab === 'register' && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text" id="name" name="name" required
                                placeholder="Enter your full name"
                                value={form.name} onChange={handleChange}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email" id="email" name="email" required autoComplete="off"
                            placeholder="Enter your email"
                            value={form.email} onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password" id="password" name="password" required autoComplete="off"
                            placeholder={tab === 'register' ? 'Min. 6 characters' : 'Enter your password'}
                            value={form.password} onChange={handleChange}
                        />
                    </div>

                    <div className="form-group captcha-group">
                        <label className="checkbox-container">
                            <input
                                type="checkbox" name="captcha"
                                checked={form.captcha} onChange={handleChange}
                            />
                            <span className="checkmark" />
                            <span className="checkbox-label">I am not a robot</span>
                        </label>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
