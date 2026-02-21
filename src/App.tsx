import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  User, 
  Baby, 
  Sparkles, 
  ChevronLeft, 
  LogOut, 
  Bell, 
  Mic, 
  PhoneCall, 
  Activity, 
  Calendar, 
  Pill, 
  FileText, 
  MapPin,
  AlertTriangle,
  Shield,
  Stethoscope
} from 'lucide-react';

// Pages (to be created)
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import CategorySelection from './pages/CategorySelection';

// Elder Pages
import ElderDashboard from './pages/Elder/ElderDashboard';
import Medications from './pages/Elder/Medications';
import HealthMetrics from './pages/Elder/HealthMetrics';
import Appointments from './pages/Elder/Appointments';
import Reports from './pages/Elder/Reports';
import Hospitals from './pages/Elder/Hospitals';
import FamilyDashboard from './pages/Elder/FamilyDashboard';

// Women Pages
import WomenDashboard from './pages/Women/WomenDashboard';
import PeriodTracker from './pages/Women/PeriodTracker';
import PCOSAnalyzer from './pages/Women/PCOSAnalyzer';
import Lifestyle from './pages/Women/Lifestyle';
import Safety from './pages/Women/Safety';

// Skin Pages
import SkinDashboard from './pages/Skin/SkinDashboard';
import SkinAnalysis from './pages/Skin/SkinAnalysis';

const Layout = ({ children, title, showBack = true }: { children: React.ReactNode, title: string, showBack?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleBack = () => {
    if (location.pathname.includes('/elder') && location.pathname !== '/elder') {
      navigate('/elder');
    } else if (location.pathname.includes('/women') && location.pathname !== '/women') {
      navigate('/women');
    } else if (location.pathname.includes('/skin') && location.pathname !== '/skin') {
      navigate('/skin');
    } else {
      navigate('/categories');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Heart className="text-rose-500 fill-rose-500" size={24} />
            CareLink
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-rose-500"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/register" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/categories" element={
          <ProtectedRoute>
            <Layout title="Choose Category" showBack={false}>
              <CategorySelection />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Elder Routes */}
        <Route path="/elder" element={
          <ProtectedRoute>
            <Layout title="Elder Care Dashboard">
              <ElderDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/elder/medications" element={
          <ProtectedRoute>
            <Layout title="Medications">
              <Medications />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/elder/health" element={
          <ProtectedRoute>
            <Layout title="Health Metrics">
              <HealthMetrics />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/elder/appointments" element={
          <ProtectedRoute>
            <Layout title="Appointments">
              <Appointments />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/elder/reports" element={
          <ProtectedRoute>
            <Layout title="Health Reports">
              <Reports />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/elder/hospitals" element={
          <ProtectedRoute>
            <Layout title="Nearby Hospitals">
              <Hospitals />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/elder/family" element={
          <ProtectedRoute>
            <Layout title="Family Dashboard">
              <FamilyDashboard />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Women Routes */}
        <Route path="/women" element={
          <ProtectedRoute>
            <Layout title="Women Care Dashboard">
              <WomenDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/women/tracker" element={
          <ProtectedRoute>
            <Layout title="Period Tracker">
              <PeriodTracker />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/women/pcos" element={
          <ProtectedRoute>
            <Layout title="PCOS Analyzer">
              <PCOSAnalyzer />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/women/lifestyle" element={
          <ProtectedRoute>
            <Layout title="Lifestyle">
              <Lifestyle />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/women/safety" element={
          <ProtectedRoute>
            <Layout title="Women Safety">
              <Safety />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Skin Routes */}
        <Route path="/skin" element={
          <ProtectedRoute>
            <Layout title="Skin Care Dashboard">
              <SkinDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/skin/analysis" element={
          <ProtectedRoute>
            <Layout title="Skin Analysis">
              <SkinAnalysis />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/categories" replace />} />
      </Routes>
    </Router>
  );
}
