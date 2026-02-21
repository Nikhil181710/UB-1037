import React from 'react';
import { motion } from 'motion/react';
import { Zap, Utensils, Flower2, Dumbbell, Droplets, ChevronRight, Sparkles } from 'lucide-react';

const recommendations = [
  {
    title: 'Balanced Diet',
    icon: Utensils,
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    tips: [
      'Include more leafy greens and seasonal fruits.',
      'Opt for complex carbohydrates like oats and quinoa.',
      'Reduce processed sugar and caffeine intake.',
      'Ensure adequate protein from plant or lean sources.'
    ]
  },
  {
    title: 'Yoga & Mindfulness',
    icon: Flower2,
    color: 'bg-indigo-500',
    lightColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    tips: [
      'Practice "Surya Namaskar" for overall flexibility.',
      'Try "Baddha Konasana" (Butterfly pose) for pelvic health.',
      '10 minutes of daily meditation for stress management.',
      'Deep breathing exercises to balance hormones.'
    ]
  },
  {
    title: 'Active Exercise',
    icon: Dumbbell,
    color: 'bg-rose-500',
    lightColor: 'bg-rose-50',
    textColor: 'text-rose-600',
    tips: [
      '30 minutes of brisk walking 5 days a week.',
      'Incorporate light strength training twice a week.',
      'Listen to your body during different cycle phases.',
      'Stay active but avoid overexertion during periods.'
    ]
  },
  {
    title: 'Hydration Tracker',
    icon: Droplets,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    tips: [
      'Drink at least 2.5 - 3 liters of water daily.',
      'Start your day with a glass of warm lemon water.',
      'Use a reusable bottle to track your intake.',
      'Herbal teas like ginger or peppermint can be soothing.'
    ]
  }
];

export default function Lifestyle() {
  return (
    <div className="space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-2xl mb-4">
          <Zap className="text-amber-500" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Lifestyle Recommendation Engine</h2>
        <p className="text-slate-500">Personalized suggestions to help you maintain hormonal balance and overall wellness.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-16 h-16 ${rec.lightColor} rounded-2xl flex items-center justify-center`}>
                <rec.icon className={rec.textColor} size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{rec.title}</h3>
            </div>

            <ul className="space-y-4">
              {rec.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <div className={`mt-1.5 w-2 h-2 rounded-full ${rec.color} shrink-0`} />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>

            <button className={`mt-8 w-full py-4 ${rec.lightColor} ${rec.textColor} rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-80 transition-all`}>
              Learn More <ChevronRight size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-amber-400 font-bold mb-4">
            <Sparkles size={20} />
            AI Insight
          </div>
          <h3 className="text-3xl font-bold mb-4">Consistency is the Secret</h3>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            Small, daily changes in your lifestyle have a compounding effect on your health. Focus on one area at a time—perhaps start with hydration this week—and gradually build your wellness routine.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full -z-0" />
      </div>
    </div>
  );
}
