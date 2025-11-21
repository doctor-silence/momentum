import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';

// Import all pages
import Layout from "./Layout.jsx";
import Dashboard from "./Dashboard";
import Generate from "./Generate";
import Profile from "./Profile";
import Pricing from "./Pricing";
import PaymentSuccess from "./PaymentSuccess";
import Calendar from "./Calendar";
import Library from "./Library";
import Analytics from "./Analytics";
import Landing from "./Landing";
import Agents from "./Agents";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import AuthCallback from "./AuthCallback.jsx";

// --- Auth Helper & Protected Route ---
const isAuthenticated = () => !!localStorage.getItem('authToken');

const ProtectedRoute = ({ children }) => {
  let location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// --- Page Name Logic ---
const PAGES = {
    Dashboard, Generate, Profile, Pricing, PaymentSuccess, Calendar, Library, Analytics, Landing, Agents, Login, Register, AuthCallback
};

function _getCurrentPage(url) {
    if (url === '/' || url.toLowerCase() === '/landing') return 'Landing';
    if (url.toLowerCase() === '/login') return 'Login';
    if (url.toLowerCase() === '/register') return 'Register';
    if (url.toLowerCase().startsWith('/auth')) return 'AuthCallback';
    
    if (url.endsWith('/')) url = url.slice(0, -1);
    let urlLastPart = url.split('/').pop().split('?')[0];
    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || 'Dashboard';
}

// This component determines the current page and wraps the Routes with the Layout
function AppWithLayout() {
    const location = useLocation();
    const currentPageName = _getCurrentPage(location.pathname);

    return (
        <Layout currentPageName={currentPageName}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/success" element={<AuthCallback />} />
                <Route path="/pricing" element={<Pricing />} />
                
                {/* Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/generate" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/paymentsuccess" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/agents" element={<ProtectedRoute><Agents /></ProtectedRoute>} />

                {/* Fallback for any other path */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    );
}

// The root component that provides the Router context
export default function Pages() {
    return (
        <Router>
            <AppWithLayout />
        </Router>
    );
}
