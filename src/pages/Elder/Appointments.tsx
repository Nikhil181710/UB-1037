import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Plus, Trash2, Clock, CheckCircle2, User, Stethoscope } from 'lucide-react';
import { api } from '../../services/api';

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newAppt, setNewAppt] = useState({ title: '', doctor: '', date: '' });

  useEffect(() => {
    fetchAppts();
  }, []);

  const fetchAppts = async () => {
    try {
      const data = await api.get('/appointments');
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/appointments', newAppt);
      setShowAdd(false);
      setNewAppt({ title: '', doctor: '', date: '' });
      fetchAppts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(`/appointments/${id}`);
        fetchAppts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAttend = async (id: number) => {
    try {
      await api.post(`/appointments/${id}/attend`, {});
      fetchAppts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Appointments</h2>
          <p className="text-slate-500">Manage your doctor visits and health checkups.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          New Appointment
        </button>
      </div>

      {showAdd && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
        >
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Appointment Title</label>
              <input
                type="text"
                required
                value={newAppt.title}
                onChange={(e) => setNewAppt({...newAppt, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Annual Checkup"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Name</label>
              <input
                type="text"
                required
                value={newAppt.doctor}
                onChange={(e) => setNewAppt({...newAppt, doctor: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Dr. Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
              <input
                type="datetime-local"
                required
                value={newAppt.date}
                onChange={(e) => setNewAppt({...newAppt, date: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="lg:col-span-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
              >
                Schedule
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {appointments.map((appt) => (
          <motion.div 
            key={appt.id}
            layout
            className={`bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-6 relative group ${appt.attended ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${appt.attended ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-500'}`}>
                  <Stethoscope size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{appt.title}</h3>
                  <p className="text-slate-500 flex items-center gap-1">
                    <User size={14} />
                    {appt.doctor}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDelete(appt.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
                  <Calendar size={14} />
                  Date
                </div>
                <p className="font-bold text-slate-900">{new Date(appt.date).toLocaleDateString()}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
                  <Clock size={14} />
                  Time
                </div>
                <p className="font-bold text-slate-900">{new Date(appt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            </div>

            {!appt.attended ? (
              <button 
                onClick={() => handleAttend(appt.id)}
                className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} />
                Mark as Attended
              </button>
            ) : (
              <div className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold flex items-center justify-center gap-2 border border-emerald-100">
                <CheckCircle2 size={20} />
                Attended
              </div>
            )}
          </motion.div>
        ))}
        {appointments.length === 0 && !loading && (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No appointments scheduled</h3>
            <p className="text-slate-500">Add your first doctor visit to stay on track.</p>
          </div>
        )}
      </div>
    </div>
  );
}
