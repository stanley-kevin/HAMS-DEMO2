/**
 * api.js — Central API service for the Hospital Appointment frontend
 * Uses Firebase Auth ID token as the Bearer token for all backend calls.
 */
import { auth } from './firebase';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// ── Get fresh Firebase token ──────────────────────────────────────────────────
async function getToken() {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken(); // auto-refreshes if expired
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────
export async function apiFetch(path, options = {}) {
    const token = await getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const Auth = {
    // Sync Firebase user to MongoDB — call after Firebase login
    syncUser: async (idToken) =>
        apiFetch('/auth/firebase-sync', {
            method: 'POST',
            body: JSON.stringify({ idToken }),
        }),

    me: () => apiFetch('/auth/me'),
};

// ── Doctors ───────────────────────────────────────────────────────────────────
export const Doctors = {
    getAll: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiFetch(`/doctors${qs ? '?' + qs : ''}`);
    },

    getById: (id) => apiFetch(`/doctors/${id}`),

    create: (data) =>
        apiFetch('/doctors', { method: 'POST', body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/doctors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    remove: (id) => apiFetch(`/doctors/${id}`, { method: 'DELETE' }),
};

// ── Appointments ──────────────────────────────────────────────────────────────
export const Appointments = {
    getMine: () => apiFetch('/appointments'),

    getAll: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiFetch(`/appointments/all${qs ? '?' + qs : ''}`);
    },

    book: (data) =>
        apiFetch('/appointments', { method: 'POST', body: JSON.stringify(data) }),

    update: (id, data) =>
        apiFetch(`/appointments/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    cancel: (id) => apiFetch(`/appointments/${id}`, { method: 'DELETE' }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const Admin = {
    stats: () => apiFetch('/admin/stats'),
    activity: () => apiFetch('/admin/activity'),
    users: () => apiFetch('/admin/users'),
    deleteUser: (id) => apiFetch(`/admin/users/${id}`, { method: 'DELETE' }),
};
