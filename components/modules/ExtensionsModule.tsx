
import React, { useState } from 'react';

interface Extension {
  id: string;
  name: string;
  icon: string;
  desc: string;
  status: 'Install' | 'Update' | 'Installed' | 'Buy';
  price?: number;
  category: 'Education' | 'Media' | 'Finance' | 'Gaming';
  color: string;
}

interface ExtensionsModuleProps {
  onBack: () => void;
}

const ExtensionsModule: React.FC<ExtensionsModuleProps> = ({ onBack }) => {
  const [installingId, setInstallingId] = useState<string | null>(null);
  const [installProgress, setInstallProgress] = useState(0);
  
  const [extensions, setExtensions] = useState<Extension[]>([
    { id: 'ext1', name: 'AI Video Editor', icon: 'fa-wand-magic-sparkles', desc: 'Pro-level edits with neural voice commands.', status: 'Install', category: 'Media', color: 'bg-purple-600' },
    { id: 'ext2', name: 'RoboClass', icon: 'fa-graduation-cap', desc: 'Neural learning modules from robot masters.', status: 'Update', category: 'Education', color: 'bg-teal-600' },
    { id: 'ext3', name: 'Gift Card Hub', icon: 'fa-gift', desc: 'Buy tokens and sync balance to your profile.', status: 'Buy', price: 50.00, category: 'Finance', color: 'bg-orange-600' },
    { id: 'ext4', name: 'Neural Game Pack', icon: 'fa-box-open', desc: 'High-speed logic games for robot cores.', status: 'Install', category: 'Gaming', color: 'bg-indigo-600' },
  ]);

  const handleAction = (ext: Extension) => {
    if (ext.status === 'Buy') {
      const confirmBuy = window.confirm(`Authorize $${ext.price} transaction for ${ext.name}? Balance will sync to profile.`);
      if (confirmBuy) {
        alert(`Transaction Verified. $${ext.price} loaded into Profile Node. Synchronization complete.`);
        setExtensions(prev => prev.map(e => e.id === ext.id ? { ...e, status: 'Installed' } : e));
      }
      return;
    }

    if (ext.status === 'Install' || ext.status === 'Update') {
      setInstallingId(ext.id);
      setInstallProgress(0);
      
      const interval = setInterval(() => {
        setInstallProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setInstallingId(null);
            setExtensions(prevExts => prevExts.map(e => e.id === ext.id ? { ...e, status: 'Installed' } : e));
            alert(`${ext.name} installed successfully. Shortcut added to Home Desktop UI.`);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col font-sans text-white overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 bg-slate-900/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack} 
            className="w-12 h-12 flex items-center justify-center hover:bg-slate-800 rounded-2xl border border-white/10 transition-all active:scale-90"
          >
            <i className="fas fa-arrow-left text-indigo-400"></i>
          </button>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-blue-500">Neural Extensions Store</h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Augment Your Robotic Logic Core</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="hidden md:flex flex-col items-end justify-center mr-4">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Sync</span>
            <span className="text-[10px] font-bold text-green-500">Node Connected</span>
          </div>
          <button className="w-12 h-12 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all"><i className="fas fa-search"></i></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 p-10 rounded-[60px] border border-indigo-500/20 shadow-2xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] group-hover:bg-indigo-600/20 transition-all duration-1000"></div>
            
            <div className="w-48 h-48 bg-slate-950 rounded-[40px] flex items-center justify-center border border-white/5 shadow-inner relative z-10">
              <i className="fas fa-puzzle-piece text-7xl text-indigo-500 animate-pulse"></i>
              <div className="absolute inset-4 border-2 border-dashed border-indigo-500/30 rounded-[30px]"></div>
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
              <div className="inline-block px-4 py-1.5 bg-indigo-600/20 border border-indigo-500/50 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                Featured Expansion Pack
              </div>
              <h3 className="text-5xl font-black tracking-tighter leading-none uppercase">Titanium Intelligence <br/><span className="text-indigo-500">V5.0 MODS</span></h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xl">Supercharge your home desktop UI with the latest neural mods. Install video editors, classes, and game packs directly into your workspace node.</p>
              <div className="flex gap-4 justify-center md:justify-start">
                <button className="px-10 py-4 bg-white text-indigo-950 font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Explore All Modlets</button>
                <button className="px-10 py-4 bg-slate-800 text-white font-black rounded-2xl text-xs uppercase tracking-widest border border-white/10 hover:bg-slate-700 transition-all">My Library</button>
              </div>
            </div>
          </div>
        </div>

        {/* Extensions Grid */}
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
              <i className="fas fa-microchip text-indigo-500"></i> Logic Enhancements
            </h4>
            <div className="flex gap-6">
              <button className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors">Most Popular</button>
              <button className="text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors">Recent Releases</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
            {extensions.map(ext => (
              <div key={ext.id} className="bg-slate-900/50 rounded-[48px] p-8 border border-white/5 flex items-center gap-8 group hover:bg-slate-900 hover:border-indigo-500/30 transition-all shadow-2xl relative">
                {installingId === ext.id && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md rounded-[48px] z-20 flex flex-col items-center justify-center p-12 space-y-6">
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-300 shadow-[0_0_15px_#6366f1]" style={{ width: `${installProgress}%` }}></div>
                    </div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">Syncing to Desktop Node: {installProgress}%</p>
                  </div>
                )}

                <div className={`w-24 h-24 rounded-[32px] ${ext.color} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform relative`}>
                   <i className={`fas ${ext.icon} text-white`}></i>
                   <div className="absolute -top-2 -right-2 w-8 h-8 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-[10px] border border-white/10">
                      <i className="fas fa-shield text-blue-400"></i>
                   </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h5 className="text-xl font-black">{ext.name}</h5>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-500 rounded-md text-[8px] font-black uppercase tracking-tighter">{ext.category}</span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium leading-tight">{ext.desc}</p>
                  
                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex gap-4">
                      {ext.price && (
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-600 uppercase">One-time Load</span>
                          <span className="text-lg font-black text-orange-400">${ext.price}</span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleAction(ext)}
                      className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                        ext.status === 'Installed' 
                          ? 'bg-slate-800 text-slate-500 cursor-default' 
                          : ext.status === 'Buy' 
                            ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-600/20' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                      }`}
                    >
                      {ext.status === 'Installed' ? <><i className="fas fa-check mr-2"></i> SYNCED</> : ext.status}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty Expansion Slot */}
            <div className="bg-slate-900/20 rounded-[48px] p-8 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center space-y-4 group hover:border-slate-700 transition-colors">
               <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-800 text-2xl group-hover:text-slate-600 group-hover:border-slate-600 transition-colors">
                  <i className="fas fa-plus"></i>
               </div>
               <div>
                  <h5 className="text-lg font-black text-slate-700 group-hover:text-slate-500 transition-colors uppercase">Register Dev Module</h5>
                  <p className="text-[10px] text-slate-800 font-bold uppercase tracking-widest">Add your own logic extension</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Status Bar */}
      <div className="h-16 bg-slate-900/95 backdrop-blur-2xl border-t border-white/5 flex items-center justify-between px-10 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1] animate-pulse"></span>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ModStore Sync: Active</p>
          </div>
          <div className="w-[1px] h-4 bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <i className="fas fa-wallet text-slate-600 text-[10px]"></i>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Balance Protocol: Online</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">Synchronization Engine v4.8 Active</p>
           <button onClick={onBack} className="px-6 py-2 bg-slate-800 hover:bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5 transition-all">
             BACK TO HOME UI
           </button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionsModule;
