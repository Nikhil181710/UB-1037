import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload, Loader2, Sparkles, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { geminiService } from '../../services/gemini';
import ReactMarkdown from 'react-markdown';

export default function SkinAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [answers, setAnswers] = useState({
    skinType: 'Normal',
    sensitivity: 'No',
    concerns: [] as string[]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    try {
      const answerStr = `Skin Type: ${answers.skinType}, Sensitivity: ${answers.sensitivity}, Concerns: ${answers.concerns.join(', ')}`;
      const aiResult = await geminiService.analyzeSkin(image, answerStr);
      setResult(aiResult || "Analysis failed. Please try again.");
    } catch (err) {
      console.error(err);
      alert("AI Analysis failed. Please check your API key.");
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleConcern = (concern: string) => {
    setAnswers(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern) 
        ? prev.concerns.filter(c => c !== concern)
        : [...prev.concerns, concern]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Skin Analysis Lab</h2>
        <p className="text-slate-500">Upload a clear photo and answer a few questions for a detailed AI report.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Step 1: Upload & Questions */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Camera className="text-emerald-500" />
              1. Upload Photo
            </h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${image ? 'border-emerald-500' : 'border-slate-200 hover:border-emerald-300 bg-slate-50'}`}
            >
              {image ? (
                <>
                  <img src={image} alt="Skin" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <RefreshCw className="text-white" size={32} />
                  </div>
                </>
              ) : (
                <>
                  <Upload className="text-slate-300 mb-2" size={48} />
                  <p className="text-slate-500 font-medium">Click to upload or take photo</p>
                  <p className="text-xs text-slate-400 mt-1">Ensure good lighting for better results</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Sparkles className="text-emerald-500" />
              2. Follow-up Questions
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">What is your skin type?</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Oily', 'Dry', 'Combination', 'Normal'].map(t => (
                    <button
                      key={t}
                      onClick={() => setAnswers({...answers, skinType: t})}
                      className={`py-2 rounded-xl font-bold text-sm transition-all ${answers.skinType === t ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Is your skin sensitive?</label>
                <div className="flex gap-2">
                  {['Yes', 'No'].map(s => (
                    <button
                      key={s}
                      onClick={() => setAnswers({...answers, sensitivity: s})}
                      className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${answers.sensitivity === s ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Primary Concerns (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {['Acne', 'Pigmentation', 'Wrinkles', 'Dryness', 'Redness', 'Dark Circles'].map(c => (
                    <button
                      key={c}
                      onClick={() => toggleConcern(c)}
                      className={`px-4 py-2 rounded-full font-bold text-xs transition-all ${answers.concerns.includes(c) ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-100'} border`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!image || analyzing}
            className="w-full py-5 bg-emerald-500 text-white rounded-[32px] font-bold text-xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {analyzing ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                AI is Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={24} />
                Generate AI Report
              </>
            )}
          </button>
        </div>

        {/* Step 2: Results */}
        <div className="lg:col-span-1">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 h-full"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="text-emerald-500" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Analysis Result</h3>
              </div>

              <div className="prose prose-slate max-w-none">
                <div className="markdown-body">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              </div>

              <div className="mt-10 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                <AlertCircle className="text-amber-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-amber-900">Ingredient Warning</h4>
                  <p className="text-sm text-amber-800 opacity-80">
                    Based on your profile, avoid products containing high concentrations of <strong>Alcohol Denat</strong> or <strong>Synthetic Fragrances</strong> as they may trigger sensitivity.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 h-full flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className={`text-slate-200 mb-4 ${analyzing ? 'animate-spin' : ''}`} size={64} />
              <h3 className="text-xl font-bold text-slate-400">Analysis Report</h3>
              <p className="text-slate-400 mt-2">Complete the steps on the left to generate your personalized skin report.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
