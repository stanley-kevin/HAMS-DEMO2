import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import EmergencyCall from './components/EmergencyCall';
import Login from './pages/Login';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Admin from './pages/Admin';

export default function App() {
    return (
        <AuthProvider>
            <EmergencyCall />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/doctors"
                        element={
                            <ProtectedRoute>
                                <Doctors />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/appointments"
                        element={
                            <ProtectedRoute>
                                <Appointments />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute adminOnly>
                                <Admin />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch-all → redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
