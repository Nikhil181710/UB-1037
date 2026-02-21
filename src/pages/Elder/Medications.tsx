import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Pill, Plus, Trash2, Clock, AlertCircle, CheckCircle2, Package } from 'lucide-react';
import { api } from '../../services/api';

export default function Medications() {
  const [meds, setMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: 'Daily',
    time: '08:00',
    stock: 30,
    refillThreshold: 5
  });

  useEffect(() => {
    fetchMeds();
  }, []);

  const fetchMeds = async () => {
    try {
      const data = await api.get('/medications');
      setMeds(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/medications', newMed);
      setShowAdd(false);
      setNewMed({ name: '', dosage: '', frequency: 'Daily', time: '08:00', stock: 30, refillThreshold: 5 });
      fetchMeds();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this medication?')) {
      try {
        await api.delete(`/medications/${id}`);
        fetchMeds();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const calculateRefillDate = (stock: number, frequency: string) => {
    const dosesPerDay = frequency === 'Daily' ? 1 : frequency === 'Twice Daily' ? 2 : 3;
    const daysLeft = Math.floor(stock / dosesPerDay);
    const refillDate = new Date();
    refillDate.setDate(refillDate.getDate() + daysLeft);
    return refillDate.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Medicine Tracker</h2>
          <p className="text-slate-500">Manage your daily prescriptions and stock.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
        >
          <Plus size={20} />
          Add Medicine
        </button>
      </div>

      {showAdd && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
        >
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Medicine Name</label>
              <input
                type="text"
                required
                value={newMed.name}
                onChange={(e) => setNewMed({...newMed, name: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. Aspirin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
              <input
                type="text"
                required
                value={newMed.dosage}
                onChange={(e) => setNewMed({...newMed, dosage: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="e.g. 500mg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
              <select
                value={newMed.frequency}
                onChange={(e) => setNewMed({...newMed, frequency: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option>Daily</option>
                <option>Twice Daily</option>
                <option>Thrice Daily</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
              <input
                type="time"
                required
                value={newMed.time}
                onChange={(e) => setNewMed({...newMed, time: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Stock</label>
              <input
                type="number"
                required
                value={newMed.stock}
                onChange={(e) => setNewMed({...newMed, stock: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
              >
                Save Medicine
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {meds.map((med) => (
          <motion.div 
            key={med.id}
            layout
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 relative group"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${med.stock <= med.refillThreshold ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                  <Pill size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{med.name}</h3>
                  <p className="text-slate-500">{med.dosage} • {med.frequency}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
                    <Clock size={14} />
                    Reminder
                  </div>
                  <p className="text-lg font-bold text-slate-900">{med.time}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
                    <Package size={14} />
                    Stock
                  </div>
                  <p className={`text-lg font-bold ${med.stock <= med.refillThreshold ? 'text-rose-500' : 'text-slate-900'}`}>
                    {med.stock} units
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-2xl text-sm font-medium">
                <AlertCircle size={18} />
                Predicted Refill Date: {calculateRefillDate(med.stock, med.frequency)}
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-center">
              {med.lastTaken && new Date(med.lastTaken).toDateString() === new Date().toDateString() ? (
                <div className="flex flex-col items-center justify-center p-6 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                  <CheckCircle2 size={32} className="mb-2" />
                  <span className="font-bold">Taken Today</span>
                </div>
              ) : (
                <button 
                  onClick={async () => {
                    await api.post(`/medications/${med.id}/take`, {});
                    fetchMeds();
                  }}
                  className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                >
                  Mark as Taken
                </button>
              )}
              <button 
                onClick={() => handleDelete(med.id)}
                className="p-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </motion.div>
        ))}
        {meds.length === 0 && !loading && (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <Pill size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No medications tracked</h3>
            <p className="text-slate-500">Add your first medicine to start tracking.</p>
          </div>
        )}
      </div>
    </div>
  );
}
