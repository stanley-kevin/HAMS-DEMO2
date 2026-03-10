import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { Appointments } from '../services/api';

function timeTo12hr(t) {
    if (!t) return t;
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function statusClass(status) {
    return { confirmed: 'confirmed', completed: 'confirmed', pending: 'pending', cancelled: 'pending' }[status] || 'pending';
}

function getInitials(name = '') {
    return name
        .split(' ')
        .filter((w) => /^[A-Z]/.test(w))
        .slice(0, 2)
        .map((w) => w[0])
        .join('') || '??';
}

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadAppointments = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await Appointments.getMine();
            setAppointments(data.appointments || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadAppointments(); }, [loadAppointments]);

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this appointment?')) return;
        try {
            await Appointments.cancel(id);
            loadAppointments();
        } catch (err) {
            alert('Failed to cancel: ' + err.message);
        }
    };

    return (
        <>
            <Navbar />
            <main>
                <section className="container appointments-section" style={{ marginTop: '2rem' }}>
                    <h1 className="section-title">My Appointments</h1>

                    {loading && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                            Loading your appointments...
                        </div>
                    )}

                    {!loading && error && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#e53e3e' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
                            {error}
                        </div>
                    )}

                    {!loading && !error && appointments.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                            <h3>No appointments yet</h3>
                            <p>Book your first appointment from the home page.</p>
                        </div>
                    )}

                    {!loading && !error && appointments.length > 0 && (
                        <div className="appointments-grid">
                            {appointments.map((a) => (
                                <div key={a._id} className="card appointment-card">
                                    <div className="appointment-header">
                                        <div className="avatar sm">{getInitials(a.doctorName)}</div>
                                        <div className="appointment-info">
                                            <div className="doctor">{a.doctorName}</div>
                                            <div className="meta">{a.specialty || 'Consultation'}</div>
                                        </div>
                                        <span className={`status-badge ${statusClass(a.status)}`}>
                                            {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="appointment-details">
                                        <div className="detail-item">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                                <path d="M16 2v4M8 2v4M3 10h18" />
                                            </svg>
                                            <span>{a.date}</span>
                                        </div>
                                        <div className="detail-item">
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12,6 12,12 16,14" />
                                            </svg>
                                            <span>{timeTo12hr(a.time)}</span>
                                        </div>
                                        {a.reason && (
                                            <div className="detail-item" style={{ gridColumn: '1/-1' }}>
                                                <span style={{ color: '#718096', fontSize: '.85rem' }}>
                                                    Reason: {a.reason}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {a.status !== 'cancelled' && a.status !== 'completed' && (
                                        <div className="appointment-actions">
                                            <button
                                                className="btn tertiary"
                                                onClick={() => handleCancel(a._id)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <footer className="site-footer">
                <div className="container">© {new Date().getFullYear()} Hospital Management System</div>
            </footer>
        </>
    );
}
