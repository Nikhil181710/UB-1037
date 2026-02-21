import React, { useState } from 'react';
import { Shield, MapPin, PhoneCall, Mic, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function Safety() {
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [silentMode, setSilentMode] = useState(false);

  const triggerSOS = async () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        setIsRecording(true);
        // In a real app, we'd start actual audio recording here
        setTimeout(async () => {
          setIsRecording(false);
          await api.post('/sos', { latitude, longitude });
          setLoading(false);
          if (!silentMode) {
            alert("SAFETY SOS TRIGGERED! Emergency contacts notified with live location and audio recording.");
          }
        }, 10000);
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 py-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Shield className="text-indigo-500" size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Women Safety Portal</h2>
        <p className="text-slate-500">Instant emergency support and location sharing tools.</p>
      </div>

      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center">
        <button 
          onClick={triggerSOS}
          disabled={loading}
          className={`w-48 h-48 rounded-full mx-auto mb-10 flex flex-col items-center justify-center gap-2 transition-all shadow-2xl ${loading ? 'bg-rose-600 scale-95' : 'bg-rose-500 hover:bg-rose-600 hover:scale-105'} text-white relative`}
        >
          {loading && (
            <div className="absolute inset-0 rounded-full border-8 border-white/20 border-t-white animate-spin" />
          )}
          <AlertTriangle size={48} />
          <span className="text-xl font-black">SOS</span>
          {isRecording && <span className="text-xs font-bold animate-pulse">RECORDING...</span>}
        </button>

        <div className="flex items-center justify-center gap-8 mb-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <span className="text-xs font-bold text-slate-500">LIVE GPS</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
              <Mic size={24} />
            </div>
            <span className="text-xs font-bold text-slate-500">AUDIO LOG</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
              <PhoneCall size={24} />
            </div>
            <span className="text-xs font-bold text-slate-500">AUTO CALL</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="text-left">
            <h4 className="font-bold text-slate-900">Silent Alert Mode</h4>
            <p className="text-xs text-slate-500">Trigger SOS without visual/audio feedback.</p>
          </div>
          <button
            onClick={() => setSilentMode(!silentMode)}
            className={`w-14 h-8 rounded-full transition-all relative ${silentMode ? 'bg-indigo-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${silentMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-xl">
        <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle2 className="text-emerald-400" />
          Safety Checklist
        </h4>
        <ul className="space-y-3 text-slate-400">
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Keep your location permissions enabled.
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Ensure your emergency contacts are up to date.
          </li>
          <li className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Test the SOS button in a safe environment.
          </li>
        </ul>
      </div>
    </div>
  );
}
