
import React, { useState, useRef } from 'react';
import { User, AppSettings } from '../types';
import { Save, Camera, CreditCard, Zap, Mail, User as UserIcon, LogOut, Trash2, AlertCircle } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  settings: AppSettings;
  onUpdateUser: (updatedUser: User | null) => void;
  onNavigate: (page: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, settings, onUpdateUser, onNavigate }) => {
  const [formData, setFormData] = useState<User>(user);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      onUpdateUser(formData);
      setIsSaving(false);
      // Simple notification
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-8 right-8 bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-4 duration-300 z-50';
      toast.innerText = 'Profile saved successfully! ✨';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }, 600);
  };

  const handleTopUp = () => {
    const newCredits = formData.credits + 10;
    const updated = { ...formData, credits: newCredits };
    setFormData(updated);
    onUpdateUser(updated);
    
    // Feedback
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 right-8 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-bottom-4 duration-300 z-50';
    toast.innerText = 'Added 10 Credits! ⚡';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      onUpdateUser(null);
      onNavigate('home');
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const creditPercentage = Math.min((formData.credits / 100) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Plan & Credits */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center">
              <CreditCard size={14} className="mr-2" />
              Subscription
            </h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-black text-slate-900 dark:text-white capitalize transition-colors">{formData.plan}</span>
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full uppercase">Active</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 transition-colors">Your plan renews on {new Date().toLocaleDateString()}.</p>
            <button 
              onClick={() => onNavigate('pricing')}
              className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-black dark:hover:bg-slate-700 transition-all transform active:scale-95"
            >
              Manage Subscription
            </button>
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-100 dark:shadow-none text-white relative overflow-hidden">
            <Zap className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
            <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-4">AI Credits</h3>
            <div className="text-4xl font-black mb-2">{formData.credits} <span className="text-lg opacity-60">left</span></div>
            <div className="w-full bg-white/20 h-2 rounded-full mb-4">
              <div 
                className="bg-white h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${creditPercentage}%` }}
              ></div>
            </div>
            <button 
              onClick={handleTopUp}
              className="w-full py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all transform active:scale-95"
            >
              Top Up Credits
            </button>
          </div>

          <button 
            onClick={() => onUpdateUser(null)}
            className="w-full py-4 border-2 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 transition-all transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Right Column: Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white transition-colors">Account Settings</h3>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:brightness-110 disabled:opacity-50 transition-all transform active:scale-95"
              >
                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-10">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <img 
                  src={formData.avatar} 
                  className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-slate-50 dark:border-slate-800 shadow-lg group-hover:brightness-75 transition-all" 
                  alt="Avatar" 
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
                <button className="absolute bottom-0 right-0 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <Camera size={18} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Avatar URL (Direct Link)</label>
                  <input 
                    type="text" 
                    value={formData.avatar}
                    onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 dark:text-white transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 flex items-center">
                  <UserIcon size={12} className="mr-1" /> Full Name
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 flex items-center">
                  <Mail size={12} className="mr-1" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all font-medium dark:text-white"
                />
              </div>
            </div>

            <div className={`mt-12 pt-8 border-t transition-all duration-300 ${showDeleteConfirm ? 'bg-red-50 dark:bg-red-950/20 p-6 rounded-3xl border-red-100 dark:border-red-900/50' : 'border-slate-50 dark:border-slate-800'}`}>
              <div className="flex items-start space-x-3 mb-2">
                {showDeleteConfirm && <AlertCircle className="text-red-500 mt-0.5" size={20} />}
                <div>
                  <h4 className="text-sm font-bold text-red-500">Danger Zone</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 transition-colors">
                    {showDeleteConfirm 
                      ? "Are you absolutely sure? This will permanently delete all your projects and data." 
                      : "Deleting your account is permanent and will remove all your AI-generated websites."}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={handleDeleteAccount}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${showDeleteConfirm ? 'bg-red-600 text-white shadow-lg' : 'border-2 border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'}`}
                >
                  <Trash2 size={16} />
                  <span>{showDeleteConfirm ? "Confirm Permanent Deletion" : "Delete Account"}</span>
                </button>
                {showDeleteConfirm && (
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-6 py-2.5 border-2 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-white dark:hover:bg-slate-700 transition-all transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;