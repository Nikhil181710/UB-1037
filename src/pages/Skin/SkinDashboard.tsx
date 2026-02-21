import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Camera, History, ShieldAlert, ChevronRight, Droplets, Sun, Moon } from 'lucide-react';

export default function SkinDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 py-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-3xl mb-6">
          <Sparkles className="text-emerald-500" size={40} />
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">AI Skin Specialist</h2>
        <p className="text-slate-500 text-lg">
          Advanced dermatological analysis using AI to provide personalized skincare routines and ingredient safety checks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/skin/analysis')}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-10 rounded-[40px] text-white shadow-2xl shadow-emerald-200 text-left relative overflow-hidden group"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
              <Camera size={32} />
            </div>
            <h3 className="text-3xl font-bold mb-4">Start New Analysis</h3>
            <p className="text-emerald-50 text-lg mb-8 opacity-90">
              Upload a photo for instant AI analysis of your skin concerns.
            </p>
            <div className="inline-flex items-center gap-2 font-bold bg-white text-emerald-600 px-6 py-3 rounded-2xl">
              Analyze Now <ChevronRight size={20} />
            </div>
          </div>
          <Sparkles className="absolute -bottom-10 -right-10 text-white/10 w-64 h-64 group-hover:rotate-12 transition-transform" />
        </motion.button>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <History className="text-emerald-500" />
              Progress Tracking
            </h3>
            <div className="flex gap-4">
              <div className="flex-1 aspect-square bg-slate-100 rounded-3xl overflow-hidden relative group">
                <img src="https://picsum.photos/seed/skin1/300/300" alt="Before" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-bold">Day 1</div>
              </div>
              <div className="flex-1 aspect-square bg-slate-100 rounded-3xl overflow-hidden relative group">
                <img src="https://picsum.photos/seed/skin2/300/300" alt="After" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-bold">Day 7</div>
              </div>
            </div>
            <p className="text-center text-sm text-slate-500 mt-4">7-day follow-up comparison available.</p>
          </div>

          <div className="bg-amber-50 p-8 rounded-[40px] border border-amber-100">
            <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="text-amber-500" />
              Ingredient Warning
            </h3>
            <p className="text-amber-800 opacity-80 mb-4">
              Our system warns against comedogenic and irritating ingredients based on your specific skin type.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Parabens', 'Sulfates', 'Silicones', 'Fragrance'].map(ing => (
                <span key={ing} className="px-3 py-1 bg-white text-amber-600 rounded-full text-xs font-bold border border-amber-200">{ing}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Routine Section */}
      <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">Daily Routine Template</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <Sun className="text-blue-500" size={28} />
              <h4 className="text-xl font-bold text-blue-900">Morning Routine</h4>
            </div>
            <ul className="space-y-4 text-blue-800/80">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Gentle Cleanser</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Vitamin C Serum</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Lightweight Moisturizer</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> SPF 50+ Sunscreen</li>
            </ul>
          </div>
          <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
            <div className="flex items-center gap-3 mb-6">
              <Moon className="text-indigo-500" size={28} />
              <h4 className="text-xl font-bold text-indigo-900">Night Routine</h4>
            </div>
            <ul className="space-y-4 text-indigo-800/80">
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Double Cleansing</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Retinol / Treatment</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Barrier Repair Cream</li>
              <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Eye Cream</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
