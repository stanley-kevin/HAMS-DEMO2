import { useState, useEffect } from 'react';
import { Doctors, Appointments } from '../services/api';

const TIME_SLOTS = [
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' },
    { value: '11:00', label: '11:00 AM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
];

export default function BookingModal({ isOpen, onClose, preselectedDoctor = null }) {
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [form, setForm] = useState({
        doctorId: '',
        date: '',
        time: '',
        patientName: '',
        patientPhone: '',
        reason: '',
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoadingDoctors(true);
            setLoadError('');
            Doctors.getAll()
                .then((data) => {
                    const list = data.doctors || [];
                    setDoctors(list);
                    if (list.length === 0) {
                        setLoadError('No doctors available at the moment.');
                    }
                })
                .catch((err) => {
                    setDoctors([]);
                    setLoadError(err.message || 'Failed to load doctors. Please try again.');
                })
                .finally(() => setLoadingDoctors(false));

            setSuccess(false);
            setError('');

            if (preselectedDoctor) {
                setForm((f) => ({ ...f, doctorId: preselectedDoctor._id || '' }));
            } else {
                setForm({ doctorId: '', date: '', time: '', patientName: '', patientPhone: '', reason: '' });
            }
        }
    }, [isOpen, preselectedDoctor]);

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const doctor = doctors.find((d) => d._id === form.doctorId);
            await Appointments.book({
                doctorId: form.doctorId,
                doctorName: doctor?.name || '',
                specialty: doctor?.specialty || '',
                date: form.date,
                time: form.time,
                patientName: form.patientName,
                patientPhone: form.patientPhone,
                reason: form.reason,
            });
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal" style={{ display: 'block' }}>
            <div className="modal-overlay" onClick={onClose} />
            <div className="modal-content">
                {success ? (
                    <div className="success-content" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div className="success-icon">✅</div>
                        <h3>Appointment Booked Successfully!</h3>
                        <p>Your appointment has been scheduled.</p>
                        <button className="btn primary" onClick={onClose}>
                            OK
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="modal-header">
                            <h3>Book Appointment</h3>
                            <button className="modal-close" onClick={onClose}>
                                &times;
                            </button>
                        </div>
                        <form className="booking-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Doctor</label>
                                {loadError && (
                                    <div style={{ color: '#e53e3e', fontSize: '.8rem', marginBottom: '4px' }}>
                                        ⚠️ {loadError}
                                    </div>
                                )}
                                <select name="doctorId" required value={form.doctorId} onChange={handleChange} disabled={loadingDoctors}>
                                    <option value="">{loadingDoctors ? 'Loading doctors…' : 'Select a doctor'}</option>
                                    {doctors.map((d) => (
                                        <option key={d._id} value={d._id}>
                                            {d.name} — {d.specialty}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        value={form.date}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Time</label>
                                    <select name="time" required value={form.time} onChange={handleChange}>
                                        <option value="">Select time</option>
                                        {TIME_SLOTS.map((s) => (
                                            <option key={s.value} value={s.value}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Patient Name</label>
                                <input
                                    type="text"
                                    name="patientName"
                                    required
                                    placeholder="Enter patient name"
                                    value={form.patientName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="patientPhone"
                                    required
                                    placeholder="Enter phone number"
                                    value={form.patientPhone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Reason for Visit</label>
                                <textarea
                                    name="reason"
                                    rows={3}
                                    placeholder="Describe your symptoms"
                                    value={form.reason}
                                    onChange={handleChange}
                                />
                            </div>
                            {error && (
                                <div style={{ color: '#e53e3e', marginBottom: '1rem', fontSize: '.875rem' }}>
                                    ⚠️ {error}
                                </div>
                            )}
                            <div className="form-actions">
                                <button type="button" className="btn ghost" onClick={onClose}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn primary" disabled={loading}>
                                    {loading ? 'Booking...' : 'Book Appointment'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
