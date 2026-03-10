import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Wait until Firebase resolves auth state before making routing decisions
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.25rem', color: '#718096',
                fontFamily: 'Inter, sans-serif',
            }}>
                🏥 Loading...
            </div>
        );
    }

    // Not logged in → go to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin-only route but user is not admin → go home
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}
