import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Baby, Sparkles, ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'elder',
    title: 'Elder Care',
    description: 'Specialized health tracking and emergency support for seniors.',
    icon: User,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    path: '/elder'
  },
  {
    id: 'women',
    title: 'Women Care',
    description: 'Period tracking, PCOS analysis, and personalized wellness.',
    icon: Baby,
    color: 'bg-rose-500',
    lightColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    path: '/women'
  },
  {
    id: 'skin',
    title: 'Skin Care',
    description: 'AI-powered skin analysis and personalized skincare routines.',
    icon: Sparkles,
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    path: '/skin'
  }
];

export default function CategorySelection() {
  const navigate = useNavigate();

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">How can we help you today?</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Select a specialized care module to get started with personalized health insights and AI-powered assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(category.path)}
            className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-300/50 transition-all text-left border border-slate-100"
          >
            <div className={`w-16 h-16 ${category.lightColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <category.icon className={category.textColor} size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{category.title}</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">
              {category.description}
            </p>

            <div className="flex items-center gap-2 font-semibold text-slate-900 group-hover:gap-4 transition-all">
              Enter Module
              <ArrowRight size={20} className={category.textColor} />
            </div>

            <div className={`absolute top-0 right-0 w-24 h-24 ${category.color} opacity-[0.03] rounded-bl-[100px] -z-10`} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
