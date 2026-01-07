
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import PricingPage from './pages/PricingPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import { AppSettings, Project, User, WebsiteSection } from './types';
import { StorageService } from './services/storageService';
import { generateWebsite } from './services/geminiService';

const App: React.FC = () => {
  // State initialized from StorageService
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [user, setUser] = useState<User | null>(() => StorageService.getUser());
  const [projects, setProjects] = useState<Project[]>(() => StorageService.getProjects());
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('app_theme');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Persistence Effects
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    StorageService.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    StorageService.saveUser(user);
  }, [user]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleGenerate = async (prompt: string) => {
    if (!user) {
      setCurrentPage('auth');
      return;
    }
    
    setIsLoading(true);
    setCurrentPage('editor-loading');
    try {
      const sections = await generateWebsite(prompt);
      const newProject: Project = {
        id: `p_${Date.now()}`,
        name: 'Untitled AI Project',
        description: prompt,
        sections,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id,
        isPublished: false,
        theme: { primaryColor: settings.primaryColor, fontFamily: settings.fontFamily }
      };
      setProjects([newProject, ...projects]);
      setActiveProject(newProject);
      setCurrentPage('editor');
    } catch (e) {
      alert("Something went wrong generating your site.");
      setCurrentPage('home');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = (updatedSections: WebsiteSection[]) => {
    if (!activeProject) return;
    const updated = { ...activeProject, sections: updatedSections, updatedAt: new Date().toISOString() };
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    setActiveProject(updated);
  };

  const deleteProject = (id: string) => {
    if (confirm("Delete this project permanently?")) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const renderContent = () => {
    if (currentPage === 'auth') {
      return <AuthPage settings={settings} onLogin={() => { setUser(StorageService.getUser()); setCurrentPage('dashboard'); }} />;
    }

    if (currentPage === 'editor' && activeProject) {
      return (
        <EditorPage 
          project={activeProject} 
          onSave={handleSaveProject} 
          onExit={() => { setCurrentPage('dashboard'); setActiveProject(null); }} 
        />
      );
    }

    if (currentPage === 'editor-loading') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 animate-pulse">Summoning AI Magic...</h2>
          <p className="text-slate-400 dark:text-slate-500 mt-2">Crafting your professional website structure.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen transition-colors duration-300">
        <Navbar 
          settings={settings} 
          user={user} 
          onNavigate={setCurrentPage} 
          currentPage={currentPage}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main className="flex-1 bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300">
          {currentPage === 'home' && (
            <LandingPage settings={settings} onGenerate={handleGenerate} onNavigate={setCurrentPage} />
          )}
          {currentPage === 'dashboard' && (
            <DashboardPage 
              projects={projects} 
              settings={settings} 
              onCreate={() => setCurrentPage('home')} 
              onEdit={(p) => { setActiveProject(p); setCurrentPage('editor'); }}
              onDelete={deleteProject}
            />
          )}
          {currentPage === 'pricing' && <PricingPage settings={settings} />}
          {currentPage === 'admin' && <AdminPage settings={settings} onUpdate={setSettings} />}
          {currentPage === 'profile' && user && (
            <ProfilePage 
              user={user} 
              settings={settings} 
              onUpdateUser={setUser} 
              onNavigate={setCurrentPage}
            />
          )}
          {currentPage === 'community' && (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
              <h2 className="text-5xl font-black mb-4 tracking-tight dark:text-white transition-colors">Community Showcase</h2>
              <p className="text-slate-500 text-lg dark:text-slate-400">Explore the most creative sites built by our users.</p>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {projects.map(p => (
                  <div key={p.id} className="group relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/3] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors">
                     <img src={p.thumbnail || `https://picsum.photos/seed/${p.id}/600/400`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={p.name} />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xl font-black mb-2">{p.name}</span>
                        <div className="flex items-center space-x-2">
                           <div className="w-5 h-5 rounded-full bg-indigo-500"></div>
                           <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">Built with NexusAI</span>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
        <Footer settings={settings} />
      </div>
    );
  };

  return (
    <div className="antialiased selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100">
      {renderContent()}
    </div>
  );
};

export default App;
