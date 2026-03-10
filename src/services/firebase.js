// firebase.js — Firebase SDK initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBoJoQS77jMuPRJpwQv_qJonPYVapOpwbw",
    authDomain: "hospital-123-93984.firebaseapp.com",
    projectId: "hospital-123-93984",
    storageBucket: "hospital-123-93984.firebasestorage.app",
    messagingSenderId: "647990628723",
    appId: "1:647990628723:web:bcf3a8b6c7af8d01e1f506",
    measurementId: "G-KNF38N3RFC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
