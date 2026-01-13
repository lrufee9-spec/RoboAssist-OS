
import React, { useState, useEffect } from 'react';

interface DJTrack {
  id: string;
  title: string;
  artist: string;
  source: 'YouTube' | 'SoundCloud' | 'Local';
  format: 'mp3' | 'wav' | 'avi' | 'mp4';
  bpm: number;
  key: string;
  status: 'Downloaded' | 'Analyzing' | 'Ready' | 'Converting';
  analysis?: {
    beatgrid: boolean;
    phrases: number;
    cues: number;
  };
}

interface StorageModuleProps {
  onBack: () => void;
}

const StorageModule: React.FC<StorageModuleProps> = ({ onBack }) => {
  const [activeView, setActiveView] = useState<'ROOT' | 'DJ_MUSIC' | 'ANALYSIS'>('ROOT');
  const [selectedTrack, setSelectedTrack] = useState<DJTrack | null>(null);
  const [isSyncingSoftware, setIsSyncingSoftware] = useState<string | null>(null);

  const [tracks, setTracks] = useState<DJTrack[]>([
    { 
      id: 't1', title: 'Cyber Pulse 2077', artist: 'Neon Rider', source: 'YouTube', format: 'mp3', 
      bpm: 128, key: 'A min', status: 'Ready', 
      analysis: { beatgrid: true, phrases: 8, cues: 4 } 
    },
    { 
      id: 't2', title: 'Robot Soul (Extended Mix)', artist: 'Binary Beats', source: 'SoundCloud', format: 'wav', 
      bpm: 124, key: 'G# maj', status: 'Downloaded' 
    },
    { 
      id: 't3', title: 'Neural Flow', artist: 'AI Mind', source: 'YouTube', format: 'mp4', 
      bpm: 130, key: 'C min', status: 'Ready',
      analysis: { beatgrid: true, phrases: 12, cues: 8 }
    },
  ]);

  const handleConvert = (id: string, newFormat: 'mp3' | 'avi' | 'mp4') => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, status: 'Converting', format: newFormat } : t));
    setTimeout(() => {
      setTracks(prev => prev.map(t => t.id === id ? { ...t, status: 'Ready' } : t));
      alert(`Conversion to ${newFormat.toUpperCase()} complete. Synchronized to local DJ folder.`);
    }, 2000);
  };

  const handleAnalyze = (track: DJTrack) => {
    setSelectedTrack(track);
    setActiveView('ANALYSIS');
    if (track.status !== 'Ready') {
      setTracks(prev => prev.map(t => t.id === track.id ? { ...t, status: 'Analyzing' } : t));
      setTimeout(() => {
        setTracks(prev => prev.map(t => t.id === track.id ? { ...t, status: 'Ready', analysis: { beatgrid: true, phrases: 10, cues: 5 } } : t));
      }, 3000);
    }
  };

  const handleSoftwareSync = (software: string) => {
    setIsSyncingSoftware(software);
    setTimeout(() => {
      setIsSyncingSoftware(null);
      alert(`Neural bridge established with ${software}. Files are now draggable from RoboAssist into your performance deck.`);
    }, 1500);
  };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col font-sans text-white overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button 
            onClick={activeView === 'ROOT' ? onBack : () => setActiveView('ROOT')} 
            className="w-12 h-12 flex items-center justify-center hover:bg-slate-800 rounded-2xl border border-white/10 transition-all active:scale-90"
          >
            <i className="fas fa-arrow-left text-emerald-400"></i>
          </button>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">Neural Storage Node</h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
              {activeView === 'ROOT' ? 'Cloud & Local Drive' : activeView === 'DJ_MUSIC' ? 'DJ Hub • Music Analysis' : 'Robo-Analysis Mode'}
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black text-emerald-500 uppercase">Available Space</span>
            <span className="text-xs font-bold">1.2 TB / 2.0 TB</span>
          </div>
          <div className="w-10 h-10 bg-slate-900 border border-white/5 rounded-xl flex items-center justify-center text-emerald-500">
            <i className="fas fa-database"></i>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeView === 'ROOT' && (
          <div className="p-10 max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4">
            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* DJ Music Hub Tile */}
              <button 
                onClick={() => setActiveView('DJ_MUSIC')}
                className="col-span-1 md:col-span-2 bg-gradient-to-br from-emerald-900/40 to-slate-900 p-10 rounded-[50px] border border-emerald-500/20 text-left hover:border-emerald-500/50 transition-all group shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                   <i className="fas fa-compact-disc text-[200px]"></i>
                </div>
                <div className="flex justify-between items-start mb-12">
                   <div className="w-20 h-20 bg-emerald-600 rounded-[30px] flex items-center justify-center text-4xl shadow-lg shadow-emerald-600/30 group-hover:scale-110 transition-transform">
                      <i className="fas fa-music text-white"></i>
                   </div>
                   <span className="px-4 py-1.5 bg-emerald-600/20 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30">Sync Enabled</span>
                </div>
                <h3 className="text-4xl font-black tracking-tighter uppercase mb-2">DJ Music Hub</h3>
                <p className="text-slate-400 text-sm max-w-sm font-medium leading-relaxed">Download from YouTube, convert to MP3/AVI, and sync with Serato/Rekordbox using Robo-Analysis.</p>
                <div className="mt-8 flex gap-3">
                  <span className="bg-slate-950 px-3 py-1 rounded-lg text-[10px] font-black text-slate-500">BEATGRID</span>
                  <span className="bg-slate-950 px-3 py-1 rounded-lg text-[10px] font-black text-slate-500">CUE POINTS</span>
                  <span className="bg-slate-950 px-3 py-1 rounded-lg text-[10px] font-black text-slate-500">CONVERT</span>
                </div>
              </button>

              <div className="bg-slate-900/50 p-10 rounded-[50px] border border-white/5 flex flex-col items-center justify-center text-center space-y-4 hover:border-blue-500/30 transition-all group">
                <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 text-2xl group-hover:scale-110 transition-transform">
                  <i className="fas fa-cloud-arrow-up"></i>
                </div>
                <div>
                  <h4 className="font-black text-lg uppercase tracking-tight">Cloud Backup</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Automatic Neural Sync</p>
                </div>
              </div>
            </div>

            {/* Storage Distribution */}
            <div className="bg-slate-900/30 p-8 rounded-[40px] border border-white/5 space-y-8">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
                <i className="fas fa-chart-pie text-emerald-500"></i> Disk Utilization
              </h4>
              <div className="space-y-6">
                {[
                  { label: 'DJ Library', size: '450 GB', percent: 60, color: 'bg-emerald-500' },
                  { label: 'System Cache', size: '120 GB', percent: 15, color: 'bg-blue-500' },
                  { label: 'User Media', size: '200 GB', percent: 25, color: 'bg-purple-500' },
                ].map(item => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-tighter">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="text-white">{item.size}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000`} style={{ width: `${item.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'DJ_MUSIC' && (
          <div className="flex-1 flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
            {/* Download Bar */}
            <div className="p-8 bg-slate-900/50 border-b border-white/5">
              <div className="max-w-4xl mx-auto flex gap-4">
                <div className="flex-1 relative group">
                  <i className="fab fa-youtube absolute left-5 top-1/2 -translate-y-1/2 text-red-600 text-xl"></i>
                  <input 
                    placeholder="Paste YouTube or SoundCloud link to download and analyze..."
                    className="w-full bg-slate-950 border-2 border-white/5 rounded-3xl py-4 pl-14 pr-6 text-sm font-medium focus:border-emerald-500 outline-none transition-all shadow-inner"
                  />
                </div>
                <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[28px] font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">
                  DOWNLOAD
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Sync Options */}
              <div className="w-64 bg-slate-950/50 border-r border-white/5 p-6 space-y-8 overflow-y-auto hidden md:block">
                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Performance Sync</h5>
                    <div className="space-y-2">
                       {['Serato DJ', 'Rekordbox', 'VirtualDJ'].map(sw => (
                         <button 
                           key={sw}
                           onClick={() => handleSoftwareSync(sw)}
                           className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between group ${isSyncingSoftware === sw ? 'bg-emerald-600 border-emerald-400' : 'bg-slate-900 border-white/5 hover:border-emerald-500/30'}`}
                         >
                            <span className="text-xs font-black uppercase tracking-tight">{sw}</span>
                            <i className={`fas ${isSyncingSoftware === sw ? 'fa-spinner animate-spin' : 'fa-link'} text-[10px] ${isSyncingSoftware === sw ? 'text-white' : 'text-slate-600 group-hover:text-emerald-500'}`}></i>
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="p-6 bg-emerald-900/10 border border-emerald-500/20 rounded-[32px]">
                    <p className="text-[9px] text-emerald-400 font-black uppercase leading-relaxed tracking-widest">Drag files from the library into your DJ software window to load instant cue points and beatgrids.</p>
                 </div>
              </div>

              {/* Tracks Library */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                 <div className="flex items-center justify-between px-2">
                    <h4 className="text-xl font-black uppercase tracking-tight">Neural Track Library</h4>
                    <div className="flex gap-4">
                       <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase">Sort: Recent</button>
                       <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase">Format: All</button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-4">
                    {tracks.map(track => (
                      <div key={track.id} className="bg-slate-900/80 border border-white/5 p-5 rounded-[32px] flex items-center gap-6 group hover:bg-slate-800 hover:border-emerald-500/20 transition-all">
                        <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-2xl text-emerald-500 relative flex-shrink-0">
                           <i className={`fas ${track.format === 'mp4' || track.format === 'avi' ? 'fa-video' : 'fa-compact-disc'}`}></i>
                           {track.status === 'Ready' && (
                             <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] text-white">
                                <i className="fas fa-check"></i>
                             </div>
                           )}
                        </div>

                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-3">
                              <h5 className="font-black text-sm truncate">{track.title}</h5>
                              <span className="px-2 py-0.5 bg-slate-800 text-[8px] font-black rounded uppercase text-slate-400">{track.format}</span>
                           </div>
                           <p className="text-[10px] text-slate-500 font-bold uppercase truncate">{track.artist} • {track.bpm} BPM • {track.key}</p>
                           {track.status === 'Ready' && track.analysis && (
                             <div className="flex gap-3 mt-1">
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter"><i className="fas fa-microchip mr-1"></i> Grid Synced</span>
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter"><i className="fas fa-map-pin mr-1"></i> {track.analysis.cues} Cues</span>
                             </div>
                           )}
                        </div>

                        <div className="flex items-center gap-3">
                           {/* Format Conversion Dropdown Simulation */}
                           <div className="relative group/conv">
                             <button className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors">
                                <i className="fas fa-shuffle"></i>
                             </button>
                             <div className="absolute right-0 top-12 w-32 bg-slate-950 border border-white/10 rounded-2xl p-2 hidden group-hover/conv:block z-50 shadow-2xl">
                                {(['mp3', 'avi', 'mp4'] as const).map(f => (
                                  <button 
                                    key={f} 
                                    onClick={() => handleConvert(track.id, f)}
                                    className="w-full text-left px-4 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-white hover:bg-white/5 rounded-lg"
                                  >
                                    To {f.toUpperCase()}
                                  </button>
                                ))}
                             </div>
                           </div>

                           <button 
                            onClick={() => handleAnalyze(track)}
                            className="px-6 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-lg"
                           >
                             {track.status === 'Analyzing' ? 'Analyzing...' : 'Analyze'}
                           </button>

                           <button className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-slate-500 hover:text-white">
                              <i className="fas fa-ellipsis-v"></i>
                           </button>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'ANALYSIS' && selectedTrack && (
          <div className="flex-1 bg-slate-950 flex flex-col p-10 animate-in zoom-in-95 duration-300">
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-emerald-600/10 rounded-3xl flex items-center justify-center text-4xl text-emerald-500 border border-emerald-500/20">
                      <i className="fas fa-wave-square"></i>
                   </div>
                   <div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter">{selectedTrack.title}</h3>
                      <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">AI Track Breakdown Mode</p>
                   </div>
                </div>
                <button onClick={() => setActiveView('DJ_MUSIC')} className="px-8 py-3 bg-slate-900 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Exit Analysis</button>
             </div>

             <div className="flex-1 flex flex-col gap-10">
                {/* Waveform Visualization Mockup */}
                <div className="h-64 bg-slate-900/50 rounded-[50px] border border-white/5 relative overflow-hidden group">
                   <div className="absolute inset-0 flex items-center justify-center gap-1 px-10">
                      {[...Array(80)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 rounded-full transition-all duration-500 ${selectedTrack.status === 'Analyzing' ? 'animate-pulse bg-emerald-500/20' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}
                          style={{ 
                            height: `${20 + Math.random() * 60}%`,
                            animationDelay: `${i * 0.05}s`
                          }}
                        ></div>
                      ))}
                   </div>
                   
                   {/* Beatgrid Markers */}
                   <div className="absolute inset-0 flex items-center justify-between px-10 pointer-events-none">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="h-full w-[1px] bg-white/10 relative">
                           {i % 4 === 0 && <span className="absolute top-4 left-1 text-[8px] font-black text-slate-600">BAR {Math.floor(i/4) + 1}</span>}
                        </div>
                      ))}
                   </div>

                   {/* Playhead */}
                   <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-white shadow-[0_0_15px_white] z-10"></div>
                   <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
                      {selectedTrack.status === 'Analyzing' ? 'Scanning Spectral Data...' : 'Sync Point Calculated'}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   {[
                     { label: 'Beatgrid Status', value: selectedTrack.analysis?.beatgrid ? 'Locked' : 'Analyzing', icon: 'fa-table-cells-large', color: 'text-emerald-500' },
                     { label: 'Phrases Detected', value: selectedTrack.analysis?.phrases || '0', icon: 'fa-diagram-project', color: 'text-blue-500' },
                     { label: 'Hot Cues Saved', value: selectedTrack.analysis?.cues || '0', icon: 'fa-map-pin', color: 'text-red-500' },
                     { label: 'Key Compatibility', value: 'Alpha-Neural v2', icon: 'fa-key', color: 'text-purple-500' },
                   ].map(stat => (
                     <div key={stat.label} className="bg-slate-900 border border-white/5 p-8 rounded-[40px] space-y-4">
                        <div className={`text-2xl ${stat.color}`}><i className={`fas ${stat.icon}`}></i></div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                           <p className="text-xl font-black uppercase">{stat.value}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-auto flex justify-center gap-6 pb-6">
                   <button className="px-12 py-4 bg-emerald-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all">
                      Export to Serato Vault
                   </button>
                   <button className="px-12 py-4 bg-slate-800 text-white rounded-3xl font-black uppercase tracking-[0.2em] border border-white/10 hover:bg-slate-700 transition-all">
                      Recalculate Grid
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Persistent Status Bar */}
      <div className="h-16 bg-slate-900/90 backdrop-blur-2xl border-t border-white/5 px-10 flex items-center justify-between z-30">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Storage Sync: Online</p>
          </div>
          <div className="w-[1px] h-4 bg-slate-800"></div>
          <div className="flex items-center gap-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Backup: 4m ago</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Neural File Engine v6.1</p>
        </div>
      </div>
    </div>
  );
};

export default StorageModule;
