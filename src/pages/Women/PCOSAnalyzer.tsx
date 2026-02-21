import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Activity, AlertCircle, CheckCircle2, Info, Sparkles } from 'lucide-react';

export default function PCOSAnalyzer() {
  const [answers, setAnswers] = useState({
    irregularCycles: false,
    weightGain: false,
    excessHair: false,
    acne: false,
    hairThinning: false,
    moodSwings: false
  });
  const [result, setResult] = useState<string | null>(null);

  const calculateRisk = () => {
    const count = Object.values(answers).filter(Boolean).length;
    if (count <= 1) return 'Low Risk';
    if (count <= 3) return 'Medium Risk';
    return 'High Risk';
  };

  const handleAnalyze = () => {
    setResult(calculateRisk());
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">PCOS/PCOD Risk Analyzer</h2>
        <p className="text-slate-500">Answer a few questions to understand your potential risk level.</p>
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="space-y-6">
          {[
            { id: 'irregularCycles', label: 'Do you experience irregular or missed periods?' },
            { id: 'weightGain', label: 'Have you noticed sudden weight gain or difficulty losing weight?' },
            { id: 'excessHair', label: 'Do you have excess hair growth on face, chest or back (Hirsutism)?' },
            { id: 'acne', label: 'Do you experience persistent acne or oily skin?' },
            { id: 'hairThinning', label: 'Have you noticed thinning of hair on the scalp?' },
            { id: 'moodSwings', label: 'Do you experience frequent mood swings or anxiety?' }
          ].map((q) => (
            <div key={q.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="font-medium text-slate-700">{q.label}</span>
              <button
                onClick={() => setAnswers({...answers, [q.id]: !answers[q.id as keyof typeof answers]})}
                className={`w-14 h-8 rounded-full transition-all relative ${answers[q.id as keyof typeof answers] ? 'bg-purple-500' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${answers[q.id as keyof typeof answers] ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAnalyze}
          className="w-full mt-10 py-5 bg-purple-500 text-white rounded-3xl font-bold text-xl hover:bg-purple-600 transition-all shadow-xl shadow-purple-100"
        >
          Analyze Risk Level
        </button>

        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 p-8 rounded-3xl border-2 border-dashed border-purple-200 text-center"
          >
            <p className="text-slate-500 font-medium mb-2">Based on your inputs, your risk level is:</p>
            <h3 className={`text-4xl font-black mb-4 ${result === 'High Risk' ? 'text-rose-500' : result === 'Medium Risk' ? 'text-amber-500' : 'text-emerald-500'}`}>
              {result}
            </h3>
            <div className="flex items-center justify-center gap-2 text-purple-600 font-bold">
              <Sparkles size={20} />
              {result === 'High Risk' ? 'We recommend consulting a gynecologist.' : 'Maintain a healthy lifestyle for prevention.'}
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <Info className="text-indigo-500" size={24} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-indigo-900 mb-2">Important Disclaimer</h4>
            <p className="text-indigo-800 opacity-80 leading-relaxed">
              This module is for <strong>educational purposes only</strong>. It is not a medical diagnosis. PCOS (Polycystic Ovary Syndrome) is a complex hormonal condition that requires clinical evaluation, blood tests, and ultrasound for an accurate diagnosis. Please consult a healthcare professional for a proper medical assessment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
