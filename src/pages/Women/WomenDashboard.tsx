import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Baby, 
  Sparkles, 
  Shield, 
  Heart, 
  ChevronRight, 
  Calendar, 
  Activity, 
  Zap,
  Droplets
} from 'lucide-react';

const modules = [
  {
    id: 'tracker',
    title: 'Period Tracker',
    description: 'Predict your next cycle and track symptoms.',
    icon: Droplets,
    color: 'bg-rose-500',
    lightColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    path: '/women/tracker'
  },
  {
    id: 'pcos',
    title: 'PCOS Analyzer',
    description: 'Educational risk assessment for PCOS/PCOD.',
    icon: Activity,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    path: '/women/pcos'
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle Engine',
    description: 'Personalized diet, yoga, and exercise tips.',
    icon: Zap,
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    path: '/women/lifestyle'
  },
  {
    id: 'safety',
    title: 'Women Safety',
    description: 'Emergency SOS and live location sharing.',
    icon: Shield,
    color: 'bg-indigo-500',
    lightColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    path: '/women/safety'
  }
];

export default function WomenDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 py-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-rose-50 rounded-3xl mb-6">
          <Baby className="text-rose-500" size={40} />
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Women Care Portal</h2>
        <p className="text-slate-500 text-lg">
          Empowering your health journey with personalized insights, safety tools, and educational resources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {modules.map((module, index) => (
          <motion.button
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(module.path)}
            className="group bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all text-left border border-slate-100 flex items-center gap-8"
          >
            <div className={`w-24 h-24 ${module.lightColor} rounded-[32px] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <module.icon className={module.textColor} size={40} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{module.title}</h3>
              <p className="text-slate-500 mb-4 leading-relaxed">
                {module.description}
              </p>
              <div className={`inline-flex items-center gap-2 font-bold ${module.textColor}`}>
                Open Module <ChevronRight size={20} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Daily Tip Section */}
      <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[40px] p-10 text-white shadow-2xl shadow-rose-200">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-sm font-bold mb-6">
              <Sparkles size={16} />
              Daily Wellness Tip
            </div>
            <h3 className="text-3xl font-bold mb-4">Hydration is Key</h3>
            <p className="text-rose-50 text-lg leading-relaxed mb-8">
              Drinking at least 8 glasses of water daily helps maintain skin elasticity, improves digestion, and keeps your energy levels stable throughout your cycle.
            </p>
            <button 
              onClick={() => navigate('/women/lifestyle')}
              className="px-8 py-4 bg-white text-rose-600 rounded-2xl font-bold hover:bg-rose-50 transition-colors"
            >
              Explore Lifestyle Tips
            </button>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-white/10 rounded-[40px] flex items-center justify-center">
            <Droplets size={120} className="text-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
