
import React from 'react';
import { Plus, MoreVertical, ExternalLink, Edit3, Trash2 } from 'lucide-react';
import { Project, AppSettings } from '../types';

interface DashboardPageProps {
  projects: Project[];
  settings: AppSettings;
  onCreate: () => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ projects, settings, onCreate, onEdit, onDelete }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">My Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and grow your digital presence.</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: settings.buttonColor }}
        >
          <Plus size={20} />
          <span>New Site</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <div key={project.id} className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-300 flex flex-col">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img 
                src={project.thumbnail || `https://picsum.photos/seed/${project.id}/600/400`} 
                alt={project.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6 space-x-4">
                <button onClick={() => onEdit(project)} className="p-3 bg-white dark:bg-slate-900 rounded-full text-indigo-600 dark:text-indigo-400 shadow-xl hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white transition-colors">
                  <Edit3 size={20} />
                </button>
                <button className="p-3 bg-white dark:bg-slate-900 rounded-full text-slate-600 dark:text-slate-300 shadow-xl hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 hover:text-white transition-colors">
                  <ExternalLink size={20} />
                </button>
              </div>
              {!project.isPublished && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Draft
                </div>
              )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.name}</h3>
                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"><MoreVertical size={18} /></button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">{project.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                <span className="text-xs text-slate-400 dark:text-slate-500">Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                <button onClick={() => onDelete(project.id)} className="text-red-400 dark:text-red-500 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create new ghost card */}
        <button 
          onClick={onCreate}
          className="aspect-[16/10] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-3 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 transition-colors">
            <Plus />
          </div>
          <span className="font-bold">Create New Site</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
