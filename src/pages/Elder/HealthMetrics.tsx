import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Droplets, Plus, AlertTriangle, History, TrendingUp } from 'lucide-react';
import { api } from '../../services/api';

export default function HealthMetrics() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [type, setType] = useState<'bp' | 'sugar'>('bp');
  const [formData, setFormData] = useState({ systolic: '', diastolic: '', value: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await api.get('/health-metrics');
      setMetrics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/health-metrics', {
        type,
        systolic: type === 'bp' ? parseInt(formData.systolic) : null,
        diastolic: type === 'bp' ? parseInt(formData.diastolic) : null,
        value: type === 'sugar' ? parseFloat(formData.value) : null,
      });
      setFormData({ systolic: '', diastolic: '', value: '' });
      fetchMetrics();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatus = (m: any) => {
    if (m.type === 'bp') {
      if (m.systolic > 140 || m.diastolic > 90) return { label: 'High', color: 'text-rose-500 bg-rose-50' };
      if (m.systolic < 90 || m.diastolic < 60) return { label: 'Low', color: 'text-blue-500 bg-blue-50' };
      return { label: 'Normal', color: 'text-emerald-500 bg-emerald-50' };
    } else {
      if (m.value > 180) return { label: 'High', color: 'text-rose-500 bg-rose-50' };
      if (m.value < 70) return { label: 'Low', color: 'text-blue-500 bg-blue-50' };
      return { label: 'Normal', color: 'text-emerald-500 bg-emerald-50' };
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Health Metrics</h2>
        <p className="text-slate-500">Track your Blood Pressure and Blood Sugar levels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
            <button 
              onClick={() => setType('bp')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${type === 'bp' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Activity size={20} />
              BP
            </button>
            <button 
              onClick={() => setType('sugar')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${type === 'sugar' ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Droplets size={20} />
              Sugar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {type === 'bp' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Systolic (Top)</label>
                  <input
                    type="number"
                    required
                    value={formData.systolic}
                    onChange={(e) => setFormData({...formData, systolic: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                    placeholder="e.g. 120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Diastolic (Bottom)</label>
                  <input
                    type="number"
                    required
                    value={formData.diastolic}
                    onChange={(e) => setFormData({...formData, diastolic: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                    placeholder="e.g. 80"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sugar Level (mg/dL)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="e.g. 100"
                />
              </div>
            )}
            <button
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${type === 'bp' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-100' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-100'}`}
            >
              Log Reading
            </button>
          </form>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Threshold Alerts
            </h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li>• BP {'>'} 140/90: High Alert</li>
              <li>• Sugar {'>'} 180: High Alert</li>
              <li>• Sugar {'<'} 70: Low Alert</li>
            </ul>
          </div>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <History className="text-slate-400" />
                Recent History
              </h3>
            </div>

            <div className="space-y-4">
              {metrics.map((m, i) => {
                const status = getStatus(m);
                return (
                  <motion.div 
                    key={m.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.type === 'bp' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                        {m.type === 'bp' ? <Activity size={24} /> : <Droplets size={24} />}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">
                          {m.type === 'bp' ? `${m.systolic}/${m.diastolic}` : `${m.value}`}
                          <span className="text-sm font-normal text-slate-500 ml-1">
                            {m.type === 'bp' ? 'mmHg' : 'mg/dL'}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500">{new Date(m.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${status.color}`}>
                      {status.label}
                    </div>
                  </motion.div>
                );
              })}
              {metrics.length === 0 && !loading && (
                <div className="text-center py-20">
                  <TrendingUp size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-500">No readings logged yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
