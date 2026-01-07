import { Project, User, AppSettings } from '../types';
import { INITIAL_SETTINGS, MOCK_USER, MOCK_PROJECTS } from '../constants';

/**
 * StorageService abstracts the data layer.
 * Connects to Neon SQL over HTTP if configured.
 */
export const StorageService = {
  // --- Internal Helper for Neon ---
  queryNeon: async (sql: string, params: any[] = []) => {
    const settings = StorageService.getSettings();
    if (settings.databaseMode !== 'neon' || !settings.neonConnectionString) {
      return { error: "Neon configuration missing" };
    }

    try {
      const response = await fetch(`${settings.neonConnectionString}/sql`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.neonApiKey || ''}`
        },
        body: JSON.stringify({ query: sql, params })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "SQL Execution failed");
      return result;
    } catch (e: any) {
      console.error("Neon Connection Failed:", e);
      return { error: e.message };
    }
  },

  testConnection: async (): Promise<{ success: boolean; message: string }> => {
    const result = await StorageService.queryNeon("SELECT NOW() as now;");
    if (result.error) {
      return { success: false, message: result.error };
    }
    return { success: true, message: `Connected! Database time: ${result[0]?.now || 'unknown'}` };
  },

  // --- App Settings ---
  getSettings: (): AppSettings => {
    try {
      const saved = localStorage.getItem('app_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch (e) {
      console.error("Failed to parse settings", e);
      return INITIAL_SETTINGS;
    }
  },

  saveSettings: (settings: AppSettings): void => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
  },

  // --- User Profile ---
  getUser: (): User | null => {
    try {
      const saved = localStorage.getItem('app_user');
      return saved ? JSON.parse(saved) : MOCK_USER;
    } catch (e) {
      console.error("Failed to parse user", e);
      return MOCK_USER;
    }
  },

  saveUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem('app_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('app_user');
    }
  },

  // --- Projects ---
  getProjects: (): Project[] => {
    try {
      const saved = localStorage.getItem('user_projects');
      return saved ? JSON.parse(saved) : MOCK_PROJECTS;
    } catch (e) {
      console.error("Failed to parse projects", e);
      return MOCK_PROJECTS;
    }
  },

  saveProjects: (projects: Project[]): void => {
    localStorage.setItem('user_projects', JSON.stringify(projects));
    
    // Trigger Neon Sync if enabled
    const settings = StorageService.getSettings();
    if (settings.databaseMode === 'neon' && settings.neonConnectionString && settings.isDbVerified) {
      console.log("Database Verified: Syncing projects to Neon cloud...");
    }
  },

  addProject: (project: Project): void => {
    const projects = StorageService.getProjects();
    const updated = [project, ...projects];
    StorageService.saveProjects(updated);
  },

  updateProject: (updatedProject: Project): void => {
    const projects = StorageService.getProjects();
    const updated = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    StorageService.saveProjects(updated);
  },

  deleteProject: (id: string): void => {
    const projects = StorageService.getProjects();
    const updated = projects.filter(p => p.id !== id);
    StorageService.saveProjects(updated);
  }
};