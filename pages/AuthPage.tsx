
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { Mail, Lock, Chrome, Github, ArrowRight } from 'lucide-react';

interface AuthPageProps {
  settings: AppSettings;
  onLogin: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ settings, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('register');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="text-center mb-10">
          <img src={settings.logo} className="w-12 h-12 mx-auto mb-4 rounded-2xl shadow-lg" alt="Logo" />
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'register' ? 'Join NexusAI' : 'Welcome Back'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Start building your digital dream today.</p>
        </div>

        <div className="space-y-4">
          <button className="w-full py-3.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center space-x-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            <Chrome size={20} className="text-blue-500" />
            <span>Continue with Google</span>
          </button>
          <button className="w-full py-3.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center space-x-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            <Github size={20} className="text-slate-900 dark:text-white" />
            <span>Continue with GitHub</span>
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-slate-300 dark:text-slate-600">
              <span className="bg-white dark:bg-slate-900 px-4">OR</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm dark:text-white"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm dark:text-white"
              />
            </div>
          </div>

          <button 
            onClick={onLogin}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>{mode === 'register' ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;