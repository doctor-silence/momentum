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

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Generate: Generate,
    
    Profile: Profile,
    
    Pricing: Pricing,
    
    PaymentSuccess: PaymentSuccess,
    
    Calendar: Calendar,
    
    Library: Library,
    
    Analytics: Analytics,
    
    Landing: Landing,
    
    Agents: Agents,
    
}

function _getCurrentPage(url) {
    if (url === '/' || url.toLowerCase() === '/landing') {
        return 'Landing'; // Explicitly return 'Landing' for root and /landing paths
    }
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || 'Dashboard'; // Fallback to Dashboard if no specific page is found
}

function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>
                {/* Default route is now Landing */}
                <Route path="/" element={<Landing />} />
                
                {/* Other routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/paymentsuccess" element={<PaymentSuccess />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/library" element={<Library />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/agents" element={<Agents />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}