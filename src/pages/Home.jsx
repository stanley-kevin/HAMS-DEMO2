import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BookingModal from '../components/BookingModal';

export default function Home() {
    const navigate = useNavigate();
    const [bookingOpen, setBookingOpen] = useState(false);

    return (
        <>
            <Navbar />
            <main id="home">
                {/* Hero */}
                <section className="hero">
                    <div className="container hero-grid">
                        <div className="hero-copy">
                            <h1>
                                Book Your <span className="accent">Doctor</span> Appointment{' '}
                                <span className="accent">Online</span>!
                            </h1>
                            <p>Easily schedule your visit with experienced doctors.</p>
                            <div className="hero-cta">
                                <button className="btn primary" onClick={() => setBookingOpen(true)}>
                                    Book Appointment
                                </button>
                                <button className="btn ghost" onClick={() => navigate('/appointments')}>
                                    View My Appointments
                                </button>
                            </div>
                        </div>
                        <div className="hero-ill">
                            <img
                                src="/assets/mernlogo.jpg"
                                alt="Hospital Management System"
                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                            />
                        </div>
                    </div>
                </section>

                {/* Feature Cards */}
                <section className="features container">
                    <div
                        className="card interactive-card"
                        onClick={() => navigate('/doctors')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-icon">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#2b6cb0" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <h3>Search Doctors</h3>
                        <p>Find specialists by department &amp; location.</p>
                    </div>

                    <div
                        className="card interactive-card"
                        onClick={() => navigate('/appointments')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="card-icon">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#2b6cb0" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <path d="M16 2v4M8 2v4M3 10h18" />
                            </svg>
                        </div>
                        <h3>Manage Appointments</h3>
                        <p>View, reschedule, or cancel your bookings.</p>
                    </div>
                </section>
            </main>

            <footer className="site-footer">
                <div className="container">
                    © {new Date().getFullYear()} Hospital Management System
                </div>
            </footer>

            <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
        </>
    );
}
