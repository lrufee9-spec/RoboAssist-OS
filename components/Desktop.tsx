
import React from 'react';
import { ModuleType } from '../types';

interface DesktopProps {
  onOpenModule: (mod: ModuleType) => void;
  batteryLevel: number;
  isCharging: boolean;
}

const Desktop: React.FC<DesktopProps> = ({ onOpenModule, batteryLevel, isCharging }) => {
  const categories = [
    {
      title: 'Neural Core',
      apps: [
        { type: ModuleType.PROFILE, icon: 'fa-user-circle', label: 'Profile', color: 'bg-teal-500' },
        { type: ModuleType.AI_CHAT, icon: 'fa-robot', label: 'Assistant', color: 'bg-indigo-600' },
        { type: ModuleType.INBOX, icon: 'fa-envelope', label: 'Inbox', color: 'bg-red-500' },
        { type: ModuleType.BATTERY, icon: 'fa-battery-bolt', label: 'Power', color: 'bg-lime-500' },
      ]
    },
    {
      title: 'Perception Nodes',
      apps: [
        { type: ModuleType.CAMERA, icon: 'fa-camera', label: 'Vision', color: 'bg-slate-700' },
        { type: ModuleType.GPS, icon: 'fa-location-crosshairs', label: 'Map Node', color: 'bg-cyan-500' },
        { type: ModuleType.VIDEO, icon: 'fa-film', label: 'Visionary', color: 'bg-orange-500' },
        { type: ModuleType.CONTENT, icon: 'fa-clapperboard', label: 'Nexus', color: 'bg-purple-600' },
      ]
    },
    {
      title: 'Storage & Logic',
      apps: [
        { type: ModuleType.FILES, icon: 'fa-folder-open', label: 'Vault', color: 'bg-yellow-500' },
        { type: ModuleType.STORAGE, icon: 'fa-database', label: 'Node Drv', color: 'bg-emerald-600' },
        { type: ModuleType.BOOKS, icon: 'fa-book-open', label: 'Libre', color: 'bg-blue-500' },
        { type: ModuleType.CHAT, icon: 'fa-comment-dots', label: 'Relay', color: 'bg-green-500' },
      ]
    },
    {
      title: 'Developer Terminal',
      apps: [
        { type: ModuleType.TERMINAL, icon: 'fa-terminal', label: 'Console', color: 'bg-slate-800' },
        { type: ModuleType.EXTENSIONS, icon: 'fa-puzzle-piece', label: 'Mods', color: 'bg-indigo-400' },
        { type: ModuleType.CONTROLLER, icon: 'fa-gamepad', label: 'Pad Hub', color: 'bg-pink-500' },
      ]
    }
  ];

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col p-6 overflow-y-auto pb-32 safe-top">
      {/* Dynamic Header Widget */}
      <div className="mt-4 mb-10 space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex justify-between items-start">
           <div className="space-y-1">
              <h1 className="text-5xl font-black text-white tracking-tighter leading-none">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</p>
           </div>
           <button onClick={() => onOpenModule(ModuleType.PROFILE)} className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5 shadow-xl">
             <img src="https://picsum.photos/seed/user/200" className="w-full h-full rounded-full object-cover" alt="" />
           </button>
        </div>

        {/* Intelligence Status Card */}
        <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 p-6 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
          
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 animate-pulse">
                <i className="fas fa-brain text-white text-2xl"></i>
             </div>
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                   <h2 className="text-sm font-black uppercase tracking-tight">Personal Assistant Online</h2>
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Neural Sync Stable • 0.8ms Latency</p>
             </div>
             <button onClick={() => onOpenModule(ModuleType.AI_CHAT)} className="px-4 py-2 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Command</button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onOpenModule(ModuleType.BATTERY)}
            className="bg-slate-900/50 p-5 rounded-[32px] border border-white/5 backdrop-blur-md text-left transition-all active:scale-95 hover:bg-slate-900"
          >
            <div className="flex items-center gap-3 mb-2">
              <i className={`fas ${isCharging ? 'fa-bolt text-yellow-400' : 'fa-battery-three-quarters text-lime-500'}`}></i>
              <span className="text-lg font-black">{Math.round(batteryLevel)}%</span>
            </div>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Power Grid</p>
          </button>
          <button 
            onClick={() => onOpenModule(ModuleType.GPS)}
            className="bg-slate-900/50 p-5 rounded-[32px] border border-white/5 backdrop-blur-md text-left transition-all active:scale-95 hover:bg-slate-900"
          >
            <div className="flex items-center gap-3 mb-2">
              <i className="fas fa-location-dot text-cyan-400"></i>
              <span className="text-lg font-black">ACTIVE</span>
            </div>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">GPS Tracking</p>
          </button>
        </div>
      </div>

      {/* App Categories Grid */}
      <div className="space-y-12 pb-10">
        {categories.map((cat) => (
          <div key={cat.title} className="space-y-5">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] px-2">{cat.title}</h3>
            <div className="grid grid-cols-4 gap-6">
              {cat.apps.map((app) => (
                <button 
                  key={app.type} 
                  onClick={() => onOpenModule(app.type)}
                  className="flex flex-col items-center gap-2 group transition-all active:scale-90"
                >
                  <div className={`w-16 h-16 rounded-[24px] ${app.color} flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform relative`}>
                    <i className={`fas ${app.icon} text-2xl text-white`}></i>
                    <div className="absolute inset-0 rounded-[24px] bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  </div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter text-center line-clamp-1 group-hover:text-white transition-colors">{app.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar - Global Assistant Shortcut */}
      <div className="fixed bottom-24 left-6 right-6 z-40">
        <button 
          onClick={() => onOpenModule(ModuleType.AI_CHAT)}
          className="w-full h-14 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-full flex items-center px-6 gap-4 shadow-2xl active:scale-[0.98] transition-all"
        >
          <i className="fas fa-search text-blue-500"></i>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex-1 text-left">Ask RoboAssist anything...</span>
          <i className="fas fa-microphone text-slate-600"></i>
        </button>
      </div>
    </div>
  );
};

export default Desktop;
