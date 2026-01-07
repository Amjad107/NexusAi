
import React, { useState } from 'react';
import { Send, Zap, Shield, Sparkles } from 'lucide-react';
import { AppSettings } from '../types';

interface LandingPageProps {
  settings: AppSettings;
  onGenerate: (prompt: string) => void;
  onNavigate: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ settings, onGenerate, onNavigate }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) onGenerate(prompt);
  };

  return (
    <div className="relative overflow-hidden transition-colors duration-300">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-white dark:via-indigo-300 dark:to-slate-400 leading-tight">
          Build Professional Websites <br /> <span className="text-indigo-600 dark:text-indigo-400">With AI Magic.</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto font-medium">
          NexusAI transforms your words into stunning, high-converting websites in seconds. 
          No coding, no design skills—just pure imagination.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800">
            <div className="pl-4">
              <Sparkles className="text-indigo-500 dark:text-indigo-400" />
            </div>
            <input
              type="text"
              placeholder="E.g., A minimalist portfolio for a landscape photographer..."
              className="w-full px-4 py-3 outline-none text-slate-700 dark:text-slate-100 bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-xl text-white font-bold flex items-center space-x-2 transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none"
              style={{ backgroundColor: settings.buttonColor }}
            >
              <span>Generate</span>
              <Send size={18} />
            </button>
          </div>
        </form>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-100 dark:shadow-none border border-slate-50 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mb-6">
              <Zap className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">Instant Generation</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Describe your vision and watch our AI create layouts, copy, and visuals in real-time.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-100 dark:shadow-none border border-slate-50 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mb-6">
              <Shield className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">Professional Quality</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Responsive, SEO-optimized, and lightning-fast. Your site is ready for the world immediately.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-100 dark:shadow-none border border-slate-50 dark:border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mb-6">
              <Sparkles className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 dark:text-white">Infinite Customization</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Tweak every detail with our visual editor or just ask the AI to change colors, fonts, and more.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
