import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await signOut(auth);
            navigate('/login');
        }
    };

    return (
        <header className="site-header">
            <div className="container nav">
                <div className="brand">🏥 Hospital Management</div>
                <button
                    className="menu-toggle"
                    aria-label="Toggle navigation"
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    ☰
                </button>
                <nav className={`menu${menuOpen ? ' open' : ''}`}>
                    <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/doctors" onClick={() => setMenuOpen(false)}>Doctors</NavLink>
                    <NavLink to="/appointments" onClick={() => setMenuOpen(false)}>Appointments</NavLink>
                    {user?.role === 'admin' && (
                        <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</NavLink>
                    )}
                    <button className="btn ghost nav-logout" onClick={handleLogout}>
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
}
