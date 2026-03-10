import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import BookingModal from '../components/BookingModal';
import { Doctors } from '../services/api';

const DEPARTMENTS = ['', 'Cardiology', 'Orthopedics', 'Dermatology', 'Neurology', 'Pediatrics'];

function getInitials(name = '') {
    return name
        .split(' ')
        .filter((w) => /^[A-Z]/.test(w))
        .slice(0, 2)
        .map((w) => w[0])
        .join('');
}

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ specialty: '', location: '', name: '' });
    const [bookingDoctor, setBookingDoctor] = useState(null);

    useEffect(() => {
        setLoading(true);
        Doctors.getAll()
            .then((data) => {
                setDoctors(data.doctors || []);
                setFiltered(data.doctors || []);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        let result = doctors;
        if (filters.specialty) result = result.filter((d) => d.specialty === filters.specialty);
        if (filters.location)
            result = result.filter((d) =>
                d.location?.toLowerCase().includes(filters.location.toLowerCase())
            );
        if (filters.name)
            result = result.filter((d) =>
                d.name?.toLowerCase().includes(filters.name.toLowerCase())
            );
        setFiltered(result);
    };

    const handleReset = () => {
        setFilters({ specialty: '', location: '', name: '' });
        setFiltered(doctors);
    };

    return (
        <>
            <Navbar />
            <main>
                <section className="container doctors-section" style={{ marginTop: '2rem' }}>
                    <h1 className="section-title">Our Doctors</h1>

                    {/* Search Form */}
                    <form className="doctor-search" onSubmit={handleSearch}>
                        <div className="field">
                            <label htmlFor="dept">Department</label>
                            <select
                                id="dept"
                                value={filters.specialty}
                                onChange={(e) => setFilters((f) => ({ ...f, specialty: e.target.value }))}
                            >
                                {DEPARTMENTS.map((d) => (
                                    <option key={d} value={d}>{d || 'All'}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="location">Location</label>
                            <input
                                id="location"
                                type="text"
                                placeholder="e.g. Mumbai"
                                value={filters.location}
                                onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="doctor-name">Doctor Name</label>
                            <input
                                id="doctor-name"
                                type="text"
                                placeholder="Search by name"
                                value={filters.name}
                                onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
                            />
                        </div>
                        <div className="actions">
                            <button className="btn primary" type="submit">Search</button>
                            <button className="btn ghost" type="button" onClick={handleReset}>Reset</button>
                        </div>
                    </form>

                    {/* State: Loading */}
                    {loading && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                            Loading doctors...
                        </div>
                    )}

                    {/* State: Error */}
                    {!loading && error && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#e53e3e' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
                            {error}
                        </div>
                    )}

                    {/* Doctors Grid */}
                    {!loading && !error && (
                        <div className="doctors-grid">
                            {filtered.length === 0 ? (
                                <div style={{ color: '#718096', padding: '2rem' }}>No doctors found.</div>
                            ) : (
                                filtered.map((doc) => (
                                    <div
                                        key={doc._id}
                                        className="card doc-card"
                                        data-dept={doc.specialty}
                                        data-location={doc.location}
                                    >
                                        <div className="avatar sm">{getInitials(doc.name)}</div>
                                        <div className="doc-info">
                                            <div className="name">{doc.name}</div>
                                            <div className="meta">
                                                {doc.specialty} • {doc.experience || ''}
                                            </div>
                                            {doc.location && <div className="meta">📍 {doc.location}</div>}
                                            {doc.availability && (
                                                <div className="meta">Available: {doc.availability}</div>
                                            )}
                                        </div>
                                        <button
                                            className="btn secondary"
                                            onClick={() => setBookingDoctor(doc)}
                                        >
                                            Book
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>
            </main>

            <footer className="site-footer">
                <div className="container">
                    © {new Date().getFullYear()} Hospital Management System
                </div>
            </footer>

            <BookingModal
                isOpen={!!bookingDoctor}
                preselectedDoctor={bookingDoctor}
                onClose={() => setBookingDoctor(null)}
            />
        </>
    );
}
