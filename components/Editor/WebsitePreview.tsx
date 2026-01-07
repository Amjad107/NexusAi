
import React from 'react';
import { WebsiteSection, ViewportMode } from '../../types';

interface WebsitePreviewProps {
  sections: WebsiteSection[];
  viewport: ViewportMode;
  onSelectSection: (id: string) => void;
  selectedId: string | null;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ sections, viewport, onSelectSection, selectedId }) => {
  const containerClasses = {
    desktop: 'w-full',
    tablet: 'max-w-2xl mx-auto shadow-2xl rounded-3xl overflow-hidden ring-4 ring-slate-200/50 dark:ring-slate-800 mt-12 mb-12',
    mobile: 'max-w-[375px] mx-auto shadow-2xl rounded-[3.5rem] overflow-hidden ring-[12px] ring-slate-900 mt-12 mb-12 aspect-[9/19] border-[6px] border-slate-800'
  };

  const renderSection = (section: WebsiteSection) => {
    const isSelected = selectedId === section.id;
    const styles = section.styles || {};
    
    // Viewport Visibility Logic
    if (viewport === 'desktop' && styles.hideOnDesktop) return null;
    if (viewport === 'tablet' && styles.hideOnTablet) return null;
    if (viewport === 'mobile' && styles.hideOnMobile) return null;

    const baseStyle: React.CSSProperties = {
      backgroundColor: styles.backgroundColor || '#ffffff',
      color: styles.textColor || '#1e293b',
      padding: styles.padding || '60px 20px',
      borderRadius: styles.borderRadius || '0px',
      marginTop: styles.marginTop || '0px',
      marginBottom: styles.marginBottom || '0px',
      textAlign: (styles.textAlign as any) || 'center',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
    };

    const sectionWrapperClass = `relative group cursor-pointer border-2 transition-all ${isSelected ? 'border-indigo-500 z-10 shadow-2xl shadow-indigo-100 ring-4 ring-indigo-500/10' : 'border-transparent hover:border-indigo-300 hover:z-10'}`;

    const content = section.content;

    switch (section.type) {
      case 'header':
        return (
          <header 
            key={section.id} 
            onClick={() => onSelectSection(section.id)} 
            style={{ ...baseStyle, padding: styles.padding || '16px 32px' }} 
            className={`${sectionWrapperClass} flex flex-wrap justify-between items-center`}
          >
            <div 
              className="font-black text-2xl tracking-tighter" 
              style={{ fontSize: styles.titleFontSize || '24px' }}
              dangerouslySetInnerHTML={{ __html: content.title || 'Brand' }}
            />
            <div className="flex flex-wrap items-center gap-6">
              {(content.links || []).map((l: string, i: number) => (
                <span key={i} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">{l}</span>
              ))}
              {content.cta && (
                <button className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110" style={{ backgroundColor: styles.buttonColor || '#000' }}>
                  {content.cta}
                </button>
              )}
            </div>
          </header>
        );
      case 'hero':
        return (
          <section 
            key={section.id} 
            onClick={() => onSelectSection(section.id)} 
            style={baseStyle} 
            className={`${sectionWrapperClass} min-h-[500px] flex flex-col items-center justify-center`}
          >
            <div className="max-w-4xl mx-auto w-full">
              <h1 
                className="font-black tracking-tight mb-6 leading-[1.1]" 
                style={{ fontSize: styles.titleFontSize || '64px' }}
                dangerouslySetInnerHTML={{ __html: content.title || 'Your Story Starts Here.' }}
              />
              <div 
                className="text-lg opacity-70 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: content.subtitle || 'Effortlessly create beautiful, high-performance websites with NexusAI assistant.' }}
              />
              {content.cta && (
                <button className="px-10 py-4 rounded-2xl text-white font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all" style={{ backgroundColor: styles.buttonColor || '#000' }}>
                  {content.cta}
                </button>
              )}
            </div>
          </section>
        );
      case 'features':
        return (
          <section key={section.id} onClick={() => onSelectSection(section.id)} style={baseStyle} className={`${sectionWrapperClass} px-8`}>
            <div className="max-w-7xl mx-auto">
              <div className="mb-16">
                 <h2 
                   className="font-black text-4xl mb-4" 
                   style={{ fontSize: styles.titleFontSize }}
                   dangerouslySetInnerHTML={{ __html: content.title || 'Our Features' }}
                 />
                 <div 
                   className="text-slate-500 max-w-2xl mx-auto"
                   dangerouslySetInnerHTML={{ __html: content.subtitle || '' }}
                 />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {(content.items || [{title:'Fast', desc:'Built for speed'},{title:'Secure', desc:'End to end encryption'},{title:'AI Power', desc:'Generative designs'}]).map((item: any, i: number) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-left hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all group">
                    <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-6 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                       <div className="w-6 h-6 bg-current rounded-lg opacity-40"></div>
                    </div>
                    <h3 
                      className="text-xl font-black mb-3 text-slate-800 dark:text-slate-100"
                      dangerouslySetInnerHTML={{ __html: item.title || 'Feature Title' }}
                    />
                    <div 
                      className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.desc || 'Detailed description of this amazing feature goes here.' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      default:
        return (
          <section key={section.id} onClick={() => onSelectSection(section.id)} style={baseStyle} className={`${sectionWrapperClass}`}>
             <div className="max-w-4xl mx-auto">
                <h2 
                  className="font-black text-3xl mb-4"
                  dangerouslySetInnerHTML={{ __html: content.title || section.type }}
                />
                <div 
                  className="text-slate-500 dark:text-slate-400"
                  dangerouslySetInnerHTML={{ __html: content.subtitle || 'Custom content section generated by AI.' }}
                />
             </div>
          </section>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-200/50 dark:bg-slate-900/50 p-6 custom-scrollbar">
      <div className={`${containerClasses[viewport]} bg-white dark:bg-slate-950 min-h-full transition-all duration-700 ease-out flex flex-col`}>
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-slate-400 dark:text-slate-600 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="w-20 h-20 rounded-[2rem] bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center mb-6 animate-bounce">
              <div className="w-8 h-8 bg-indigo-200 dark:bg-indigo-800 rounded-lg"></div>
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Canvas is Empty</h3>
            <p className="text-sm max-w-xs text-center leading-relaxed">Type a prompt in the AI Studio to start building your professional website.</p>
          </div>
        ) : (
          sections.map((section) => {
            const rendered = renderSection(section);
            if (!rendered) return null;
            return rendered;
          })
        )}
      </div>
    </div>
  );
};

export default WebsitePreview;
