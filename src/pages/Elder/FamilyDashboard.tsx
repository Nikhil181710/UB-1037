import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Activity, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Users,
  Bell,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { api } from '../../services/api';

export default function FamilyDashboard() {
  const [meds, setMeds] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const adherenceRate = meds.length > 0 ? 85 : 0; // Simulated adherence rate

  const chartData = metrics
    .filter(m => m.type === 'bp')
    .map(m => ({
      time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      systolic: m.systolic,
      diastolic: m.diastolic
    }))
    .reverse();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="text-blue-500" />
            Family Monitoring Portal
          </h2>
          <p className="text-slate-500">Real-time health and safety overview for your loved ones.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full font-bold text-sm border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Live Sync Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Adherence & Alerts */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Medication Adherence</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * adherenceRate) / 100} className="text-emerald-500" />
                </svg>
                <span className="absolute text-2xl font-black text-slate-900">{adherenceRate}%</span>
              </div>
            </div>
            <p className="text-center text-sm text-slate-500">Overall adherence for the last 7 days.</p>
          </div>

          <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100">
            <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
              <Bell className="text-rose-500" />
              Critical Alerts
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 p-4 bg-white rounded-2xl shadow-sm">
                <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                <p className="text-sm text-slate-700"><strong>Low Stock:</strong> Aspirin is below refill threshold (3 units left).</p>
              </div>
              <div className="flex gap-3 p-4 bg-white rounded-2xl shadow-sm">
                <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                <p className="text-sm text-slate-700"><strong>Location:</strong> User is currently at Home.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Health Trends */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
            <TrendingUp className="text-rose-500" />
            Blood Pressure Trends
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="systolic" stroke="#f43f5e" fillOpacity={1} fill="url(#colorSys)" strokeWidth={3} />
                <Area type="monotone" dataKey="diastolic" stroke="#3b82f6" fillOpacity={0} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Appointment Attendance</h3>
          <div className="space-y-4">
            {appointments.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="font-bold text-slate-900">{a.title}</p>
                  <p className="text-xs text-slate-500">{new Date(a.date).toLocaleDateString()}</p>
                </div>
                {a.attended ? (
                  <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold">
                    <CheckCircle2 size={16} /> Attended
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 text-sm font-bold">
                    <Clock size={16} /> Pending
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Live Location</h3>
          <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/800/450')] bg-cover opacity-50" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-bounce">
                <MapPin className="text-white" size={24} />
              </div>
              <div className="mt-2 px-4 py-1 bg-white rounded-full shadow-md text-xs font-bold text-slate-900">
                Current Location: Home
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">Last updated: 2 minutes ago</p>
        </div>
      </div>
    </div>
  );
}
