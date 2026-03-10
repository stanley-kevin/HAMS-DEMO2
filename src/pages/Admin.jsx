import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { Admin as AdminApi, Appointments } from '../services/api';

const STATUS_COLOR = {
    pending: '#ed8936',
    confirmed: '#38a169',
    cancelled: '#e53e3e',
    completed: '#3182ce',
};

export default function AdminPage() {
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [filterStatus, setFilterStatus] = useState('');
    const [loadingAppts, setLoadingAppts] = useState(true);

    const loadStats = useCallback(async () => {
        try {
            const { stats: s } = await AdminApi.stats();
            setStats(s);
        } catch (err) {
            console.error('Stats error:', err);
        }
    }, []);

    const loadActivity = useCallback(async () => {
        try {
            const { activity: a } = await AdminApi.activity();
            setActivity(a || []);
        } catch {
            setActivity([]);
        }
    }, []);

    const loadAllAppointments = useCallback(async (status = '') => {
        setLoadingAppts(true);
        try {
            const params = status ? { status } : {};
            const { appointments: list } = await Appointments.getAll(params);
            setAppointments(list || []);
        } catch {
            setAppointments([]);
        } finally {
            setLoadingAppts(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
        loadActivity();
        loadAllAppointments();
    }, [loadStats, loadActivity, loadAllAppointments]);

    const handleStatusChange = async (id, status) => {
        try {
            await Appointments.update(id, { status });
            setAppointments((prev) =>
                prev.map((a) => (a._id === id ? { ...a, status } : a))
            );
            loadStats();
        } catch {
            alert('Failed to update status');
        }
    };

    const handleDeleteAppt = async (id) => {
        if (!window.confirm('Delete this appointment permanently?')) return;
        try {
            await Appointments.cancel(id);
            setAppointments((prev) => prev.filter((a) => a._id !== id));
            loadStats();
        } catch {
            alert('Failed to delete appointment');
        }
    };

    return (
        <>
            <Navbar />
            <main>
                <section className="container admin-section" style={{ marginTop: '2rem' }}>
                    <h1 className="section-title">Admin Dashboard</h1>

                    {/* Stats */}
                    <div className="admin-stats">
                        {[
                            { icon: '👨‍⚕️', label: 'Total Doctors', value: stats?.totalDoctors },
                            { icon: '👥', label: 'Registered Users', value: stats?.totalUsers },
                            { icon: '📅', label: "Today's Appointments", value: stats?.todayAppointments },
                            { icon: '⏳', label: 'Pending Approvals', value: stats?.pendingAppointments },
                            { icon: '✅', label: 'Confirmed', value: stats?.confirmedAppointments },
                            { icon: '📋', label: 'Total Appointments', value: stats?.totalAppointments },
                        ].map(({ icon, label, value }) => (
                            <div className="stat-card" key={label}>
                                <div className="stat-icon">{icon}</div>
                                <div className="stat-info">
                                    <div className="stat-number">{value ?? '—'}</div>
                                    <div className="stat-label">{label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Two-col grid */}
                    <div className="admin-grid">
                        {/* Quick Actions */}
                        <div className="card">
                            <div className="panel-head">Quick Actions</div>
                            <div className="admin-actions">
                                {['Add Doctor', 'Approve Appointments', 'Manage Departments', 'View Reports'].map(
                                    (action) => (
                                        <button
                                            key={action}
                                            className="chip admin-btn"
                                            onClick={() => alert(`${action} — coming soon`)}
                                        >
                                            {action}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="card">
                            <div className="panel-head">Recent Activity</div>
                            <div className="activity-list">
                                {activity.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: '#718096', padding: '1rem' }}>
                                        No recent activity
                                    </div>
                                ) : (
                                    activity.map((a, i) => (
                                        <div className="activity-item" key={i}>
                                            <div className="activity-icon">{a.icon}</div>
                                            <div className="activity-text">
                                                <div>{a.text}</div>
                                                <div className="activity-time">
                                                    {new Date(a.time).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* All Appointments Table */}
                    <div className="card" style={{ marginTop: '2rem' }}>
                        <div
                            className="panel-head"
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <span>All Appointments</span>
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    loadAllAppointments(e.target.value);
                                }}
                                style={{
                                    padding: '.4rem .8rem',
                                    borderRadius: '6px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '.875rem',
                                }}
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {loadingAppts ? (
                            <div style={{ textAlign: 'center', color: '#718096', padding: '1.5rem' }}>
                                Loading...
                            </div>
                        ) : appointments.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#718096', padding: '1.5rem' }}>
                                No appointments found
                            </p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f7fafc', textAlign: 'left' }}>
                                            {['Patient', 'Doctor', 'Date & Time', 'Reason', 'Status', 'Actions'].map(
                                                (h) => (
                                                    <th key={h} style={{ padding: '.75rem 1rem' }}>{h}</th>
                                                )
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((a) => (
                                            <tr key={a._id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '.75rem 1rem' }}>
                                                    <div><strong>{a.patientName}</strong></div>
                                                    <div style={{ color: '#718096', fontSize: '.8rem' }}>{a.patientPhone}</div>
                                                </td>
                                                <td style={{ padding: '.75rem 1rem' }}>
                                                    {a.doctorName}
                                                    <br />
                                                    <span style={{ color: '#718096', fontSize: '.8rem' }}>{a.specialty}</span>
                                                </td>
                                                <td style={{ padding: '.75rem 1rem' }}>
                                                    {a.date}
                                                    <br />
                                                    {a.time}
                                                </td>
                                                <td style={{ padding: '.75rem 1rem', color: '#718096' }}>{a.reason || '—'}</td>
                                                <td style={{ padding: '.75rem 1rem' }}>
                                                    <select
                                                        value={a.status}
                                                        onChange={(e) => handleStatusChange(a._id, e.target.value)}
                                                        style={{
                                                            padding: '.25rem .5rem',
                                                            borderRadius: '4px',
                                                            border: '1px solid #e2e8f0',
                                                            color: STATUS_COLOR[a.status],
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td style={{ padding: '.75rem 1rem' }}>
                                                    <button
                                                        className="btn tertiary"
                                                        style={{ padding: '.25rem .75rem', fontSize: '.8rem' }}
                                                        onClick={() => handleDeleteAppt(a._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <footer className="site-footer">
                <div className="container">© {new Date().getFullYear()} Hospital Management System</div>
            </footer>
        </>
    );
}
