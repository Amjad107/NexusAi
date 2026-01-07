
import React from 'react';
import { AppSettings } from '../types';
import { StorageService } from '../services/storageService';
import { Save, Database, ShieldAlert, Globe, Server, CheckCircle2, XCircle, Loader2, Zap } from 'lucide-react';

interface AdminPageProps {
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = React.useState<AppSettings>(settings);
  const [testStatus, setTestStatus] = React.useState<{ status: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ status: 'idle' });

  const handleSave = () => {
    onUpdate(formData);
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 right-8 bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm z-50 animate-in slide-in-from-bottom-4';
    toast.innerText = 'System configuration updated! 🚀';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const testNeonConnection = async () => {
    setTestStatus({ status: 'loading' });
    
    // Temporarily apply current form settings for the test
    const originalSettings = StorageService.getSettings();
    StorageService.saveSettings(formData);
    
    try {
      const result = await StorageService.testConnection();
      if (result.success) {
        setTestStatus({ status: 'success', message: result.message });
        setFormData(prev => ({ ...prev, isDbVerified: true }));
      } else {
        setTestStatus({ status: 'error', message: result.message });
        setFormData(prev => ({ ...prev, isDbVerified: false }));
      }
    } catch (e: any) {
      setTestStatus({ status: 'error', message: e.message });
    } finally {
      // Revert to original settings if not explicitly saved by user later
      // But we keep the verification state in the local form
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Console</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Configure your SaaS platform parameters.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all transform active:scale-95"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Database Connectivity Section */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Database size={20} />
              </div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white">Database & Connectivity</h2>
            </div>
            {formData.isDbVerified && (
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full border border-green-100 dark:border-green-900/30">
                <CheckCircle2 size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => setFormData({...formData, databaseMode: 'local'})}
                className={`cursor-pointer flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.databaseMode === 'local' ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800 shadow-sm' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl ${formData.databaseMode === 'local' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                    <Server size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold dark:text-white">Local Only</h4>
                    <p className="text-[10px] text-slate-500">Browser Storage</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.databaseMode === 'local' ? 'border-indigo-600' : 'border-slate-300'}`}>
                  {formData.databaseMode === 'local' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                </div>
              </div>

              <div 
                onClick={() => setFormData({...formData, databaseMode: 'neon'})}
                className={`cursor-pointer flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.databaseMode === 'neon' ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800 shadow-sm' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 opacity-60 hover:opacity-100'}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-xl ${formData.databaseMode === 'neon' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                    <Globe size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold dark:text-white">Neon Cloud</h4>
                    <p className="text-[10px] text-slate-500">Global SQL Sync</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.databaseMode === 'neon' ? 'border-indigo-600' : 'border-slate-300'}`}>
                  {formData.databaseMode === 'neon' && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                </div>
              </div>
            </div>

            {formData.databaseMode === 'neon' && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Endpoint URL</label>
                    <input 
                      type="text" 
                      placeholder="https://ep-soft-pond-a2...tech"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10 dark:text-white text-sm"
                      value={formData.neonConnectionString || ''}
                      onChange={(e) => setFormData({...formData, neonConnectionString: e.target.value, isDbVerified: false})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">API Key / Secret</label>
                    <input 
                      type="password" 
                      placeholder="Paste your Neon API key here"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10 dark:text-white text-sm"
                      value={formData.neonApiKey || ''}
                      onChange={(e) => setFormData({...formData, neonApiKey: e.target.value, isDbVerified: false})}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                   <div className="flex items-center space-x-3">
                      {testStatus.status === 'idle' && <Database size={16} className="text-slate-400" />}
                      {testStatus.status === 'loading' && <Loader2 size={16} className="text-indigo-500 animate-spin" />}
                      {testStatus.status === 'success' && <CheckCircle2 size={16} className="text-green-500" />}
                      {testStatus.status === 'error' && <XCircle size={16} className="text-red-500" />}
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {testStatus.status === 'idle' && "Ready to test connectivity"}
                        {testStatus.status === 'loading' && "Querying Neon API..."}
                        {testStatus.status === 'success' && (testStatus.message || "Connection verified!")}
                        {testStatus.status === 'error' && (testStatus.message || "Connection failed")}
                      </span>
                   </div>
                   <button 
                     onClick={testNeonConnection}
                     disabled={testStatus.status === 'loading' || !formData.neonConnectionString}
                     className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 disabled:opacity-50 transition-all flex items-center space-x-2"
                   >
                     <Zap size={14} />
                     <span>Test Neon Connection</span>
                   </button>
                </div>

                <div className="mt-2 flex items-start space-x-2 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                  <ShieldAlert size={14} className="shrink-0" />
                  <span>Connectivity over HTTP requires your Neon endpoint to be accessible via standard fetch. Ensure your project allows inbound traffic from this domain.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Branding Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-50 dark:border-slate-800 pb-4 mb-4 dark:text-white">Branding</h2>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Platform Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                value={formData.siteName}
                onChange={(e) => setFormData({...formData, siteName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Brand Colors</label>
              <div className="flex space-x-4 mb-4">
                <input 
                  type="color" 
                  className="w-10 h-10 border-none rounded-lg cursor-pointer bg-transparent"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                />
                <input 
                  type="text" 
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white font-mono text-sm"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Commercial Card */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-50 dark:border-slate-800 pb-4 mb-4 dark:text-white">Commercial</h2>
            
            <div className="space-y-6">
              <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Pro Plan Config</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">Price ($)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                    value={formData.pricing.pro.price}
                    onChange={(e) => setFormData({
                      ...formData, 
                      pricing: { ...formData.pricing, pro: { ...formData.pricing.pro, price: parseInt(e.target.value) }}
                    })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">AI Credits</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white"
                    value={formData.pricing.pro.credits}
                    onChange={(e) => setFormData({
                      ...formData, 
                      pricing: { ...formData.pricing, pro: { ...formData.pricing.pro, credits: parseInt(e.target.value) }}
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
