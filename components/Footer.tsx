
import React from 'react';
import { AppSettings } from '../types';

interface FooterProps {
  settings: AppSettings;
}

const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex justify-center items-center mb-6">
          <img src={settings.logo} className="w-6 h-6 grayscale opacity-50 mr-2" alt="Logo" />
          <span className="text-white font-semibold">{settings.siteName}</span>
        </div>
        <p className="text-sm mb-4">The ultimate AI companion for web design and development.</p>
        <div className="flex justify-center space-x-6 text-xs mb-8">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
          <a href="#" className="hover:text-white">Contact Us</a>
        </div>
        <p className="text-xs">&copy; {new Date().getFullYear()} {settings.siteName}. Designed and Coded with precision.</p>
      </div>
    </footer>
  );
};

export default Footer;
