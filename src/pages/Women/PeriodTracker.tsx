import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Droplets, Heart, Smile, AlertCircle, Sparkles } from 'lucide-react';

export default function PeriodTracker() {
  const [lastDate, setLastDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [prediction, setPrediction] = useState<string | null>(null);

  const [symptoms, setSymptoms] = useState({
    flow: 'Medium',
    pain: 3,
    mood: 'Happy'
  });

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastDate) return;
    
    const date = new Date(lastDate);
    date.setDate(date.getDate() + parseInt(cycleLength));
    setPrediction(date.toDateString());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Cycle Predictor</h2>
        <p className="text-slate-500">Enter your details to estimate your next cycle.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Prediction Form */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Calendar className="text-rose-500" />
            Input Details
          </h3>
          <form onSubmit={handlePredict} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Period Start Date</label>
              <input
                type="date"
                required
                value={lastDate}
                onChange={(e) => setLastDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Average Cycle Length (Days)</label>
              <input
                type="number"
                required
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Period Duration (Days)</label>
              <input
                type="number"
                required
                value={periodLength}
                onChange={(e) => setPeriodLength(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
            >
              Predict Next Cycle
            </button>
          </form>

          {prediction && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 bg-rose-50 rounded-2xl border border-rose-100 text-center"
            >
              <p className="text-rose-600 font-semibold mb-1">Your next period is likely to start on:</p>
              <h4 className="text-2xl font-black text-rose-700">{prediction}</h4>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-rose-500 font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                Stay Prepared
              </div>
            </motion.div>
          )}
        </div>

        {/* Symptom Tracker */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Droplets className="text-rose-500" />
            Track Symptoms
          </h3>
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Flow Intensity</label>
              <div className="flex gap-2">
                {['Light', 'Medium', 'Heavy'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSymptoms({...symptoms, flow: f})}
                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${symptoms.flow === f ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Pain Scale (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={symptoms.pain}
                onChange={(e) => setSymptoms({...symptoms, pain: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
                <span>Mild</span>
                <span className="text-rose-500 text-lg">{symptoms.pain}</span>
                <span>Severe</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Current Mood</label>
              <div className="grid grid-cols-2 gap-3">
                {['Happy', 'Irritable', 'Sad', 'Anxious'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSymptoms({...symptoms, mood: m})}
                    className={`py-3 rounded-xl font-bold transition-all ${symptoms.mood === m ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">
              Log Today's Symptoms
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
        <AlertCircle className="text-amber-500 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-amber-900">Medical Disclaimer</h4>
          <p className="text-sm text-amber-800 opacity-80">
            This tracker is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </div>
  );
}
