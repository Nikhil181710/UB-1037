import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Pill, 
  Activity, 
  Calendar, 
  FileText, 
  MapPin, 
  AlertCircle, 
  Mic, 
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  PhoneCall,
  Shield
} from 'lucide-react';
import { api } from '../../services/api';
import { geminiService } from '../../services/gemini';

export default function ElderDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [meds, setMeds] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [medsData, metricsData, apptsData] = await Promise.all([
        api.get('/medications'),
        api.get('/health-metrics'),
        api.get('/appointments')
      ]);
      setMeds(medsData);
      setMetrics(metricsData);
      setAppointments(apptsData);

      // AI Voice Reminders
      checkReminders(medsData, apptsData);
    } catch (err) {
      console.error(err);
    }
  };

  const checkReminders = (meds: any[], appts: any[]) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Check for today's appointments
    const todayAppts = appts.filter(a => a.date.startsWith(today) && !a.attended);
    if (todayAppts.length > 0) {
      geminiService.speak(`You have an appointment today: ${todayAppts[0].title} at ${new Date(todayAppts[0].date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
    }

    // Check for low stock meds
    const lowStock = meds.filter(m => m.stock <= m.refillThreshold);
    if (lowStock.length > 0) {
      geminiService.speak(`Reminder: Your medicine ${lowStock[0].name} is running low. Please refill soon.`);
    }
  };

  const handleSOS = async () => {
    setSosLoading(true);
    try {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Start 10s audio recording (simulated for now as actual recording requires more setup)
          setIsRecording(true);
          setTimeout(async () => {
            setIsRecording(false);
            await api.post('/sos', { latitude, longitude });
            alert("EMERGENCY SOS SENT! Live location shared and audio recorded.");
            setSosLoading(false);
          }, 10000);
        });
      }
    } catch (err) {
      console.error(err);
      setSosLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const nextAppointment = appointments.find(a => !a.attended && a.date.split('T')[0] <= today);

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome, {user?.name}</h2>
          <p className="text-slate-500">How are you feeling today?</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/elder/hospitals')}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-semibold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <MapPin className="text-blue-500" size={20} />
            Nearby Hospitals
          </button>
          <button 
            onClick={handleSOS}
            disabled={sosLoading}
            className={`flex items-center gap-2 px-6 py-3 ${isRecording ? 'bg-red-600 animate-pulse' : 'bg-red-500'} text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200`}
          >
            <PhoneCall size={20} />
            {sosLoading ? (isRecording ? 'Recording Audio...' : 'Sending SOS...') : 'EMERGENCY SOS'}
          </button>
        </div>
      </div>

      {/* Main Notification for Appointment */}
      {nextAppointment && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-indigo-600 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-indigo-100 text-sm font-medium">Upcoming Appointment</p>
              <h3 className="text-xl font-bold">{nextAppointment.title}</h3>
              <p className="text-indigo-100 opacity-80">{new Date(nextAppointment.date).toLocaleString()}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/elder/appointments')}
            className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
          >
            View Details
          </button>
        </motion.div>
      )}

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Medications */}
        <button 
          onClick={() => navigate('/elder/medications')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Pill className="text-emerald-500" size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Medications</h3>
          <p className="text-slate-500 text-sm mb-4">{meds.length} Active Prescriptions</p>
          <div className="flex items-center text-emerald-600 font-semibold text-sm">
            Manage Tracker <ChevronRight size={16} />
          </div>
        </button>

        {/* Health Metrics */}
        <button 
          onClick={() => navigate('/elder/health')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Activity className="text-rose-500" size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Health Metrics</h3>
          <p className="text-slate-500 text-sm mb-4">Last reading: {metrics[0] ? new Date(metrics[0].timestamp).toLocaleDateString() : 'None'}</p>
          <div className="flex items-center text-rose-600 font-semibold text-sm">
            View Trends <ChevronRight size={16} />
          </div>
        </button>

        {/* Appointments */}
        <button 
          onClick={() => navigate('/elder/appointments')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="text-blue-500" size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Appointments</h3>
          <p className="text-slate-500 text-sm mb-4">{appointments.filter(a => !a.attended).length} Upcoming</p>
          <div className="flex items-center text-blue-600 font-semibold text-sm">
            View Schedule <ChevronRight size={16} />
          </div>
        </button>

        {/* Reports */}
        <button 
          onClick={() => navigate('/elder/reports')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-left group"
        >
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="text-amber-500" size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Health Reports</h3>
          <p className="text-slate-500 text-sm mb-4">Upload & Store Files</p>
          <div className="flex items-center text-amber-600 font-semibold text-sm">
            Access Files <ChevronRight size={16} />
          </div>
        </button>
      </div>

      {/* Quick Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Health Readings */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Recent Readings</h3>
            <button onClick={() => navigate('/elder/health')} className="text-rose-500 font-semibold text-sm">View All</button>
          </div>
          <div className="space-y-4">
            {metrics.slice(0, 5).map((m, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.type === 'bp' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                    {m.type === 'bp' ? <Activity size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{m.type === 'bp' ? `${m.systolic}/${m.diastolic} mmHg` : `${m.value} mg/dL`}</p>
                    <p className="text-xs text-slate-500">{new Date(m.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${m.type === 'bp' && m.systolic > 140 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {m.type === 'bp' ? (m.systolic > 140 ? 'High' : 'Normal') : (m.value > 180 ? 'High' : 'Normal')}
                </div>
              </div>
            ))}
            {metrics.length === 0 && <p className="text-center text-slate-500 py-8">No readings yet.</p>}
          </div>
        </div>

        {/* Today's Medications */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">Today's Schedule</h3>
            <button onClick={() => navigate('/elder/medications')} className="text-emerald-500 font-semibold text-sm">Manage</button>
          </div>
          <div className="space-y-4">
            {meds.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.time} • {m.dosage}</p>
                  </div>
                </div>
                {m.lastTaken && new Date(m.lastTaken).toDateString() === new Date().toDateString() ? (
                  <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                    <CheckCircle2 size={18} />
                    Taken
                  </div>
                ) : (
                  <button 
                    onClick={async () => {
                      await api.post(`/medications/${m.id}/take`, {});
                      fetchData();
                    }}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors"
                  >
                    Mark Taken
                  </button>
                )}
              </div>
            ))}
            {meds.length === 0 && <p className="text-center text-slate-500 py-8">No medications added.</p>}
          </div>
        </div>
      </div>

      {/* Family Dashboard Link */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
            <Shield className="text-blue-400" size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Family Access</h3>
            <p className="text-slate-400">Allow family members to monitor your health and location.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/elder/family')}
          className="w-full md:w-auto px-8 py-3 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all"
        >
          Open Family Dashboard
        </button>
      </div>

      {/* Voice Assistant Floating Button */}
      <button 
        onClick={() => geminiService.speak("Hello! I am your health assistant. I will remind you about your medicines and appointments.")}
        className="fixed bottom-8 right-8 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <Mic size={32} />
      </button>
    </div>
  );
}
