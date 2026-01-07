import React, { useState, useCallback, useRef } from 'react';
import { 
  Monitor, Smartphone, Tablet, Save, Download, 
  Share, ChevronLeft, MessageSquare, 
  Layout, Trash2, Plus, ArrowUp, ArrowDown,
  AlignLeft, AlignCenter, AlignRight, Undo2, Redo2,
  Type as TypeIcon, Palette, Eye, EyeOff, MoreHorizontal,
  Bold, Italic, Underline, List, Link as LinkIcon, Code
} from 'lucide-react';
import WebsitePreview from '../components/Editor/WebsitePreview';
import { ViewportMode, WebsiteSection, Project } from '../types';
import { editWebsite } from '../services/geminiService';

interface EditorPageProps {
  project: Project;
  onSave: (sections: WebsiteSection[]) => void;
  onExit: () => void;
}

const EditorPage: React.FC<EditorPageProps> = ({ project, onSave, onExit }) => {
  const [sections, setSections] = useState<WebsiteSection[]>(project.sections || []);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [chatPrompt, setChatPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');

  // History state for Undo/Redo
  const [history, setHistory] = useState<WebsiteSection[][]>([project.sections || []]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const selectedSection = sections.find(s => s.id === selectedSectionId);

  // Helper to update history
  const pushToHistory = useCallback((newSections: WebsiteSection[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newSections))); // Deep clone to avoid ref issues
    
    // Limit history to 50 steps
    if (newHistory.length > 50) {
      newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(49);
    } else {
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setSections(JSON.parse(JSON.stringify(history[prevIndex])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setSections(JSON.parse(JSON.stringify(history[nextIndex])));
    }
  };

  const handleAIChat = async () => {
    if (!chatPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const updated = await editWebsite(chatPrompt, sections);
      setSections(updated);
      pushToHistory(updated);
      setChatPrompt('');
    } catch (e) {
      alert("AI was busy. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateSectionStyle = (id: string, key: string, value: string | number | boolean) => {
    const newSections = sections.map(s => s.id === id ? { ...s, styles: { ...s.styles, [key]: value } } : s);
    setSections(newSections);
    pushToHistory(newSections);
  };

  const updateSectionContent = (id: string, key: string, value: any) => {
    const newSections = sections.map(s => s.id === id ? { ...s, content: { ...s.content, [key]: value } } : s);
    setSections(newSections);
    pushToHistory(newSections);
  };

  const deleteSection = (id: string) => {
    const newSections = sections.filter(s => s.id !== id);
    setSections(newSections);
    pushToHistory(newSections);
    setSelectedSectionId(null);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;
    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(newIndex, 0, moved);
    setSections(newSections);
    pushToHistory(newSections);
  };

  // Rich Text Action helper
  const execFormat = (tag: string) => {
    if (!selectedSection) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    // Using document.execCommand for simplicity in this browser context
    // In a real production app, we would use a proper library like Tiptap or Lexical
    document.execCommand(tag, false);
  };

  const RichToolbar = ({ onAction }: { onAction: (tag: string) => void }) => (
    <div className="flex items-center space-x-1 mb-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
      <button onClick={() => onAction('bold')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-all"><Bold size={14} /></button>
      <button onClick={() => onAction('italic')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-all"><Italic size={14} /></button>
      <button onClick={() => onAction('underline')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-all"><Underline size={14} /></button>
      <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
      <button onClick={() => onAction('insertUnorderedList')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-all"><List size={14} /></button>
      <button onClick={() => {
        const url = prompt('Enter URL:');
        if (url) document.execCommand('createLink', false, url);
      }} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-all"><LinkIcon size={14} /></button>
      <button onClick={() => onAction('formatBlock')} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 transition-all"><Code size={14} /></button>
    </div>
  );

  const currentSectionIndex = sections.findIndex(s => s.id === selectedSectionId);

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 flex-col md:flex-row overflow-hidden transition-colors duration-300">
      {/* Left Sidebar - Workspace */}
      <div className="w-full md:w-96 h-1/2 md:h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-30 shadow-2xl">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button onClick={onExit} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors">
            <ChevronLeft />
          </button>
          <div className="flex flex-col items-center">
            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">Design Editor</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-tight truncate max-w-[120px]">{project.name}</span>
          </div>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">AI</div>
        </div>

        <div className="flex border-b border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'ai' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10' : 'text-slate-400 dark:text-slate-500'}`}
          >
            AI Studio
          </button>
          <button 
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'manual' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10' : 'text-slate-400 dark:text-slate-500'}`}
          >
            Manual Edit
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {activeTab === 'ai' ? (
            <div className="space-y-5">
              <div className="bg-slate-900 dark:bg-black text-white p-5 rounded-2xl shadow-inner relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <MessageSquare size={48} />
                </div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2 animate-pulse"></span>
                  AI Prompt
                </h4>
                <p className="text-sm text-slate-300 dark:text-slate-400 leading-relaxed font-medium">
                  "Make the font larger", "Make it look more corporate", or "Add a testimonial slider".
                </p>
              </div>
              
              <div className="relative">
                <textarea
                  className="w-full h-40 p-4 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none shadow-sm text-slate-900 dark:text-slate-100"
                  placeholder="Describe your design vision..."
                  value={chatPrompt}
                  onChange={(e) => setChatPrompt(e.target.value)}
                />
                <button
                  onClick={handleAIChat}
                  disabled={isGenerating || !chatPrompt}
                  className="absolute bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 hover:scale-105 active:scale-95 transition-all"
                >
                  {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MessageSquare size={20} />}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {!selectedSection ? (
                <div className="text-center py-16 px-6">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                    <Layout size={32} />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2">No selection</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Click any section on the preview canvas to unlock manual style and layout controls.</p>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 pb-12">
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm text-indigo-600 dark:text-indigo-400"><Layout size={18} /></div>
                      <div>
                        <h3 className="font-black text-slate-800 dark:text-white text-[10px] uppercase tracking-widest">{selectedSection.type}</h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">Section ID: {selectedSection.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => moveSection(currentSectionIndex, 'up')}
                        disabled={currentSectionIndex === 0}
                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-900 rounded-md disabled:opacity-30 transition-all"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button 
                        onClick={() => moveSection(currentSectionIndex, 'down')}
                        disabled={currentSectionIndex === sections.length - 1}
                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-900 rounded-md disabled:opacity-30 transition-all"
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button onClick={() => deleteSection(selectedSection.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Appearance Controls */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                       <Palette size={14} className="text-indigo-500 dark:text-indigo-400" />
                       <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Appearance</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 block">Background</label>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="color" 
                            value={selectedSection.styles.backgroundColor || '#ffffff'} 
                            onChange={(e) => updateSectionStyle(selectedSection.id, 'backgroundColor', e.target.value)}
                            className="w-8 h-8 rounded-lg overflow-hidden border-2 border-slate-100 dark:border-slate-800 p-0 cursor-pointer shadow-sm"
                          />
                          <input 
                            type="text" 
                            value={selectedSection.styles.backgroundColor || '#ffffff'} 
                            onChange={(e) => updateSectionStyle(selectedSection.id, 'backgroundColor', e.target.value)}
                            className="w-full px-2 py-1.5 text-[10px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-mono text-slate-900 dark:text-slate-100"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 block">Corner Radius</label>
                        <input 
                          type="range" 
                          min="0" max="100"
                          value={parseInt(selectedSection.styles.borderRadius || '0')} 
                          onChange={(e) => updateSectionStyle(selectedSection.id, 'borderRadius', `${e.target.value}px`)}
                          className="w-full accent-indigo-600 dark:accent-indigo-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Visibility Controls */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                       <Eye size={14} className="text-indigo-500 dark:text-indigo-400" />
                       <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Visibility</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                       <button 
                         onClick={() => updateSectionStyle(selectedSection.id, 'hideOnDesktop', !selectedSection.styles.hideOnDesktop)}
                         className={`flex items-center justify-between p-3 rounded-xl border transition-all ${selectedSection.styles.hideOnDesktop ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 text-red-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                       >
                         <div className="flex items-center space-x-3">
                           <Monitor size={16} />
                           <span className="text-xs font-bold">Show on Desktop</span>
                         </div>
                         {selectedSection.styles.hideOnDesktop ? <EyeOff size={16} /> : <Eye size={16} />}
                       </button>

                       <button 
                         onClick={() => updateSectionStyle(selectedSection.id, 'hideOnTablet', !selectedSection.styles.hideOnTablet)}
                         className={`flex items-center justify-between p-3 rounded-xl border transition-all ${selectedSection.styles.hideOnTablet ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 text-red-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                       >
                         <div className="flex items-center space-x-3">
                           <Tablet size={16} />
                           <span className="text-xs font-bold">Show on Tablet</span>
                         </div>
                         {selectedSection.styles.hideOnTablet ? <EyeOff size={16} /> : <Eye size={16} />}
                       </button>

                       <button 
                         onClick={() => updateSectionStyle(selectedSection.id, 'hideOnMobile', !selectedSection.styles.hideOnMobile)}
                         className={`flex items-center justify-between p-3 rounded-xl border transition-all ${selectedSection.styles.hideOnMobile ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 text-red-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                       >
                         <div className="flex items-center space-x-3">
                           <Smartphone size={16} />
                           <span className="text-xs font-bold">Show on Mobile</span>
                         </div>
                         {selectedSection.styles.hideOnMobile ? <EyeOff size={16} /> : <Eye size={16} />}
                       </button>
                    </div>
                  </div>

                  {/* Content Controls */}
                  <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                       <TypeIcon size={14} className="text-indigo-500 dark:text-indigo-400" />
                       <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">Content Edit</span>
                    </div>

                    {selectedSection.content.title !== undefined && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Section Title</label>
                        <RichToolbar onAction={execFormat} />
                        <div 
                          contentEditable
                          onBlur={(e) => updateSectionContent(selectedSection.id, 'title', e.currentTarget.innerHTML)}
                          dangerouslySetInnerHTML={{ __html: selectedSection.content.title }}
                          className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-slate-100 min-h-[40px]"
                        />
                      </div>
                    )}

                    {selectedSection.content.subtitle !== undefined && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Subtitle/Description</label>
                        <RichToolbar onAction={execFormat} />
                        <div 
                          contentEditable
                          onBlur={(e) => updateSectionContent(selectedSection.id, 'subtitle', e.currentTarget.innerHTML)}
                          dangerouslySetInnerHTML={{ __html: selectedSection.content.subtitle }}
                          className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-900 dark:text-slate-100 min-h-[120px] max-h-[300px] overflow-y-auto"
                        />
                      </div>
                    )}

                    <div className="pt-4">
                      <button className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-slate-200 dark:shadow-none hover:bg-black dark:hover:bg-slate-100 transition-all group">
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                        <span>Add New Element</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Editor Toolbar */}
        <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-20 shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setViewport('desktop')} 
                className={`p-2 rounded-lg transition-all ${viewport === 'desktop' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                title="Desktop View"
              >
                <Monitor size={18} />
              </button>
              <button 
                onClick={() => setViewport('tablet')} 
                className={`p-2 rounded-lg transition-all ${viewport === 'tablet' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                title="Tablet View"
              >
                <Tablet size={18} />
              </button>
              <button 
                onClick={() => setViewport('mobile')} 
                className={`p-2 rounded-lg transition-all ${viewport === 'mobile' ? 'bg-white dark:bg-slate-700 shadow-md text-indigo-600 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                title="Mobile View"
              >
                <Smartphone size={18} />
              </button>
            </div>

            {/* Undo / Redo Controls */}
            <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={undo}
                disabled={historyIndex === 0}
                className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 transition-all hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={18} />
              </button>
              <button 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-30 transition-all hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4 border-r border-slate-100 dark:border-slate-800 pr-4 mr-4 text-slate-900 dark:text-slate-100">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status:</span>
              <div className="flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-bold">Auto-saved</span>
              </div>
            </div>
            
            <button className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
              <Download size={16} />
              <span className="hidden sm:inline">Export Code</span>
            </button>
            <button onClick={() => onSave(sections)} className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all border border-indigo-100 dark:border-indigo-900/50">
              <Save size={16} />
              <span className="hidden sm:inline">Save Project</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-2.5 text-xs font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95">
              <Share size={16} />
              <span className="hidden sm:inline uppercase">Publish Live</span>
            </button>
          </div>
        </div>

        <WebsitePreview 
          sections={sections} 
          viewport={viewport} 
          onSelectSection={setSelectedSectionId}
          selectedId={selectedSectionId}
        />
      </div>
    </div>
  );
};

export default EditorPage;