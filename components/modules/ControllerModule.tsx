
import React, { useState, useEffect } from 'react';

interface ControllerModuleProps {
  onBack: () => void;
}

const ControllerModule: React.FC<ControllerModuleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'CONTROLLER' | 'TV_SYNC' | 'SETTINGS'>('CONTROLLER');
  const [isTvSynced, setIsTvSynced] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectedPad, setConnectedPad] = useState<string | null>('Xbox Elite v2');

  const controllers = [
    { id: 'ps4', name: 'DualShock 4', icon: 'fa-gamepad', color: 'text-blue-500' },
    { id: 'xbox', name: 'Xbox Elite v2', icon: 'fa-gamepad', color: 'text-green-500' },
    { id: 'ps5', name: 'DualSense Edge', icon: 'fa-gamepad', color: 'text-indigo-400' },
  ];

  const handleTvSync = () => {
    setIsSyncing(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setSyncProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsSyncing(false);
        setIsTvSynced(true);
        setSyncProgress(0);
      }
    }, 100);
  };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col font-sans text-white overflow-hidden">
      {/* Header Bar */}
      <div className="p-6 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack} 
            className="w-12 h-12 flex items-center justify-center hover:bg-slate-800 rounded-2xl border border-white/10 transition-all active:scale-90"
          >
            <i className="fas fa-arrow-left text-pink-400"></i>
          </button>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">Peripheral Command Hub</h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Device & Screen Synchronization</p>
          </div>
        </div>

        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('CONTROLLER')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'CONTROLLER' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            CONTROLLERS
          </button>
          <button 
            onClick={() => setActiveTab('TV_SYNC')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'TV_SYNC' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            TV SYNC
          </button>
          <button 
            onClick={() => setActiveTab('SETTINGS')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'SETTINGS' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            SYNC SETTINGS
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        {activeTab === 'CONTROLLER' && (
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {controllers.map((pad) => (
                <button 
                  key={pad.id}
                  onClick={() => setConnectedPad(pad.name)}
                  className={`relative p-10 rounded-[40px] border transition-all group overflow-hidden ${connectedPad === pad.name ? 'bg-indigo-900/30 border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.2)]' : 'bg-slate-900/50 border-white/5 hover:border-white/20'}`}
                >
                  {connectedPad === pad.name && (
                    <div className="absolute top-4 right-4 bg-green-500 w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                  )}
                  <div className={`text-6xl mb-8 group-hover:scale-110 transition-transform ${connectedPad === pad.name ? pad.color : 'text-slate-700'}`}>
                    <i className={`fas ${pad.icon}`}></i>
                  </div>
                  <h3 className="text-xl font-black mb-1">{pad.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {connectedPad === pad.name ? 'Connected • 0.5ms Lag' : 'Tap to Pair Node'}
                  </p>
                </button>
              ))}
            </div>

            <div className="bg-slate-900/40 p-10 rounded-[50px] border border-white/5 flex flex-col md:flex-row items-center gap-12">
              <div className="w-48 h-48 bg-slate-950 rounded-[40px] flex items-center justify-center border border-white/5 shadow-inner relative group cursor-pointer">
                 <i className="fas fa-plus text-5xl text-slate-800 group-hover:text-blue-500 transition-colors"></i>
                 <div className="absolute inset-4 border-2 border-dashed border-slate-800 rounded-[30px] group-hover:border-blue-500/50 transition-colors"></div>
              </div>
              <div className="flex-1 space-y-6 text-center md:text-left">
                <h4 className="text-3xl font-black tracking-tighter">Add New Gamepad</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-lg">Pair any Bluetooth pad to your RoboOS. Once connected, your controls will automatically sync with the "Content" gaming hub settings.</p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Scan for Pads</button>
                  <button className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-slate-700 transition-all">Manual Link</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TV_SYNC' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative aspect-video bg-black rounded-[60px] overflow-hidden border-8 border-slate-900 shadow-[0_0_100px_rgba(236,72,153,0.15)] group">
              {/* TV Screen Mockup */}
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/tvplay/1200/800')] bg-cover opacity-40 blur-[2px]"></div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

              {isSyncing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 bg-slate-950/80 backdrop-blur-md">
                   <div className="relative w-32 h-32">
                      <svg className="w-full h-full -rotate-90">
                         <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                         <circle 
                            cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" 
                            strokeDasharray="377" 
                            strokeDashoffset={377 - (377 * syncProgress / 100)} 
                            className="text-pink-500 transition-all duration-100" 
                          />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">{syncProgress}%</div>
                   </div>
                   <div className="text-center">
                      <h4 className="text-2xl font-black uppercase tracking-tighter">Synchronizing Neural Display</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Matching framerates and control mappings...</p>
                   </div>
                </div>
              ) : isTvSynced ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                   <div className="w-24 h-24 bg-pink-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.5)]">
                      <i className="fas fa-tv text-4xl text-white"></i>
                   </div>
                   <div className="text-center">
                      <h4 className="text-4xl font-black uppercase tracking-tighter">TV LINK ACTIVE</h4>
                      <p className="text-xs text-pink-400 font-black uppercase tracking-widest mt-2 animate-pulse">Broadcasting at 4K • 120Hz</p>
                   </div>
                   <button onClick={() => setIsTvSynced(false)} className="px-10 py-3 bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Disconnect Stream</button>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                   <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                      <i className="fas fa-tv-slash text-3xl"></i>
                   </div>
                   <div className="text-center">
                      <h4 className="text-2xl font-black uppercase tracking-tighter">TV HUB DISCONNECTED</h4>
                      <p className="text-sm text-slate-500 font-medium">Connect to your local Smart TV to play games synced from Content.</p>
                   </div>
                   <button onClick={handleTvSync} className="px-12 py-4 bg-pink-600 hover:bg-pink-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-pink-600/30 active:scale-95 transition-all">INITIALIZE SYNC</button>
                </div>
              )}

              {/* HUD Elements */}
              <div className="absolute top-10 left-10 flex gap-4 opacity-40">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900/50 p-8 rounded-[40px] border border-white/5 space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-600/10 rounded-2xl flex items-center justify-center text-pink-500"><i className="fas fa-expand"></i></div>
                    <h5 className="text-lg font-black uppercase tracking-tight">Aspect Ratio Sync</h5>
                 </div>
                 <p className="text-xs text-slate-500 font-medium">Force the TV Hub to match your mobile device's current aspect ratio for pixel-perfect remote play.</p>
                 <button className="w-full py-3 bg-slate-800 rounded-xl text-[10px] font-black uppercase hover:bg-pink-600 transition-all">Lock to 16:9</button>
              </div>

              <div className="bg-slate-900/50 p-8 rounded-[40px] border border-white/5 space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500"><i className="fas fa-shield-halved"></i></div>
                    <h5 className="text-lg font-black uppercase tracking-tight">Latency Guard</h5>
                 </div>
                 <p className="text-xs text-slate-500 font-medium">Prioritize signal stability over resolution to ensure 0ms input lag during high-stakes gaming.</p>
                 <button className="w-full py-3 bg-slate-800 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-all">Optimize Link</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SETTINGS' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
             <div className="bg-slate-900 p-8 rounded-[40px] border border-white/10 space-y-8">
                <div className="flex items-center justify-between">
                   <h4 className="text-xl font-black uppercase tracking-tight">Global Game Settings Sync</h4>
                   <i className="fas fa-rotate text-blue-500 animate-spin-slow"></i>
                </div>

                <div className="space-y-6">
                   {[
                     { label: 'Control Layout Sync', desc: 'Sync custom mappings to all pads', active: true },
                     { label: 'Sensitivity Persistence', desc: 'Keep stick sensitivity across all games', active: true },
                     { label: 'Haptic Feedback Pulse', desc: 'Synchronize rumble across all nodes', active: false },
                     { label: 'Neural Aim Assist', desc: 'AI-assisted precision for Robo-Games', active: true }
                   ].map(item => (
                     <div key={item.label} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                        <div className="flex-1">
                           <p className="text-sm font-black text-white">{item.label}</p>
                           <p className="text-[10px] text-slate-500 font-bold uppercase">{item.desc}</p>
                        </div>
                        <button className={`w-12 h-6 rounded-full relative transition-colors ${item.active ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                           <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.active ? 'left-7' : 'left-1'}`}></div>
                        </button>
                     </div>
                   ))}
                </div>

                <div className="pt-6 border-t border-white/5">
                   <button className="w-full py-4 bg-white text-slate-900 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-105 transition-all">Save Global Config</button>
                </div>
             </div>

             <div className="p-8 bg-indigo-900/20 border border-indigo-500/20 rounded-[40px] flex items-center gap-6">
                <i className="fas fa-circle-info text-2xl text-indigo-400"></i>
                <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest leading-relaxed">Changes made here will be instantly pushed to your PS4/Xbox pad and synced with the active TV display link.</p>
             </div>
          </div>
        )}
      </div>

      {/* Persistent Status Footer */}
      <div className="h-16 bg-slate-900/90 backdrop-blur-2xl border-t border-white/5 px-10 flex items-center justify-between z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${connectedPad ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-slate-700'}`}></span>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pad Link: {connectedPad || 'Offline'}</p>
          </div>
          <div className="w-[1px] h-4 bg-slate-800"></div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isTvSynced ? 'bg-pink-500 shadow-[0_0_8px_#ec4899]' : 'bg-slate-700'}`}></span>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TV Display: {isTvSynced ? 'Synced' : 'Ready'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Low-Latency Engine v5.2 Active</p>
        </div>
      </div>
    </div>
  );
};

export default ControllerModule;
