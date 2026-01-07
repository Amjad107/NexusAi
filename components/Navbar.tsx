
import React from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { AppSettings } from '../types';

interface NavbarProps {
  settings: AppSettings;
  user: any;
  onNavigate: (page: string) => void;
  currentPage: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ settings, user, onNavigate, currentPage, theme, onToggleTheme }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Community', id: 'community' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'About', id: 'about' }
  ];

  return (
    <nav className="sticky top-0 z-50 glass dark:dark-glass border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <img src={settings.logo} alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
            <span className="ml-2 text-xl font-black tracking-tight dark:text-white" style={{ color: theme === 'dark' ? '#fff' : settings.primaryColor }}>
              {settings.siteName}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`text-xs font-black uppercase tracking-widest transition-colors ${currentPage === link.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-300'}`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => onNavigate('profile')}
                  className="p-0.5 rounded-[1rem] border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-400 transition-all active:scale-95"
                  title="Profile Settings"
                >
                  <img src={user.avatar} className="w-9 h-9 rounded-[0.85rem] object-cover" alt="Profile" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="px-6 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: settings.buttonColor }}
              >
                Sign In
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button onClick={onToggleTheme} className="p-2 text-slate-500 dark:text-slate-400">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-500 dark:text-slate-400">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass dark:dark-glass animate-in slide-in-from-top duration-300 border-b border-slate-200 dark:border-slate-800">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => { onNavigate(link.id); setIsOpen(false); }}
                className="block w-full text-left px-3 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800"
              >
                {link.name}
              </button>
            ))}
            {user ? (
              <button
                onClick={() => { onNavigate('profile'); setIsOpen(false); }}
                className="block w-full text-left px-3 py-3 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800"
              >
                My Profile
              </button>
            ) : (
              <button
                onClick={() => { onNavigate('auth'); setIsOpen(false); }}
                className="block w-full text-center mt-4 px-3 py-3 rounded-xl text-white font-black text-sm uppercase tracking-widest"
                style={{ backgroundColor: settings.buttonColor }}
              >
                Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
