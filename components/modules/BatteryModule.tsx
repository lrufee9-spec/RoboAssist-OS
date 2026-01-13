
import React, { useState, useEffect } from 'react';

interface BatteryModuleProps {
  batteryLevel: number;
  isCharging: boolean;
  onBack: () => void;
}

const BatteryModule: React.FC<BatteryModuleProps> = ({ batteryLevel, isCharging, onBack }) => {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [brightness, setBrightness] = useState(80);
  const [gpsActive, setGpsActive] = useState(true);

  const drainers = [
    { name: 'Neural Display', usage: 42, icon: 'fa-desktop', color: 'bg-blue-500' },
    { name: 'Robo-Sensors (GPS)', usage: 28, icon: 'fa-location-crosshairs', color: 'bg-orange-500' },
    { name: 'AI Perception Core', usage: 15, icon: 'fa-brain', color: 'bg-purple-500' },
    { name: 'Background Sync', usage: 10, icon: 'fa-rotate', color: 'bg-emerald-500' },
    { name: 'Neural Audio', usage: 5, icon: 'fa-volume-high', color: 'bg-pink-500' },
  ];

  const patterns = [
    { day: 'Mon', usage: 85 },
    { day: 'Tue', usage: 92 },
    { day: 'Wed', usage: 78 },
    { day: 'Thu', usage: 88 },
    { day: 'Fri', usage: 95 },
    { day: 'Sat', usage: 60 },
    { day: 'Sun', usage: 65 },
  ];

  const handleLowPowerToggle = () => {
    setIsLowPowerMode(!isLowPowerMode);
    if (!isLowPowerMode) {
      setBrightness(30);
      setGpsActive(false);
      alert("Low Power Mode Enabled: Neural luminosity reduced, GPS node suspended.");
    } else {
      setBrightness(80);
      setGpsActive(true);
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col font-sans text-white overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack} 
            className="w-12 h-12 flex items-center justify-center hover:bg-slate-800 rounded-2xl border border-white/10 transition-all active:scale-90"
          >
            <i className="fas fa-arrow-left text-lime-400"></i>
          </button>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-green-500">Neural Power Node</h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Battery Life & Energy Analysis</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="px-4 py-2 bg-slate-950 rounded-2xl border border-white/10 flex items-center gap-3">
             <i className={`fas ${isCharging ? 'fa-bolt text-yellow-400' : 'fa-battery-bolt text-lime-400'}`}></i>
             <span className="text-xl font-black">{Math.round(batteryLevel)}%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Status Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Battery Health & Time Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-10 rounded-[50px] border border-white/5 shadow-2xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
               <div className="absolute -right-20 -top-20 w-64 h-64 bg-lime-500/10 rounded-full blur-[80px]"></div>
               
               <div className="relative">
                  <svg className="w-48 h-48 -rotate-90">
                     <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                     <circle 
                        cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                        strokeDasharray="553" 
                        strokeDashoffset={553 - (553 * batteryLevel / 100)} 
                        className={`${batteryLevel < 20 ? 'text-red-500' : 'text-lime-500'} transition-all duration-1000 shadow-[0_0_20px_rgba(132,204,22,0.3)]`} 
                      />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black">{Math.round(batteryLevel)}%</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isCharging ? 'Charging' : 'Discharging'}</span>
                  </div>
               </div>

               <div className="flex-1 space-y-6 text-center md:text-left">
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Estimated Time</h3>
                    <p className="text-5xl font-black text-lime-400">{isCharging ? '--:--' : `${Math.floor(batteryLevel / 10)}h ${Math.round((batteryLevel % 10) * 6)}m`}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Until Empty Node Depletion</p>
                  </div>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                      <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Cell Health</p>
                      <p className="text-lg font-black text-white">98% OPTIMAL</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                      <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Cycle Count</p>
                      <p className="text-lg font-black text-white">124 REFS</p>
                    </div>
                  </div>
               </div>
            </div>

            {/* Drain Analysis */}
            <div className="bg-slate-900/30 p-8 rounded-[40px] border border-white/5 space-y-8">
               <div className="flex justify-between items-center px-2">
                 <h4 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                   <i className="fas fa-chart-line text-lime-500"></i> Power Usage Breakdown
                 </h4>
                 <span className="text-[10px] font-black text-slate-600 uppercase">Last 24 Hours</span>
               </div>
               
               <div className="space-y-6">
                 {drainers.map(d => (
                   <div key={d.name} className="flex items-center gap-6">
                     <div className={`w-12 h-12 ${d.color} rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-black/20`}>
                        <i className={`fas ${d.icon} text-white`}></i>
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-center mb-1 text-[11px] font-black uppercase tracking-tighter">
                          <span className="text-slate-300">{d.name}</span>
                          <span className="text-white">{d.usage}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full ${d.color} transition-all duration-1000 delay-300`} style={{ width: `${d.usage}%` }}></div>
                        </div>
                     </div>
                     {d.usage > 25 && (
                       <div className="text-orange-500 text-[10px] font-black uppercase animate-pulse">High Drain</div>
                     )}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Action & Patterns Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-slate-900 p-8 rounded-[40px] border border-white/10 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-tight">Robo-Action Center</h4>
              
              <div className="space-y-4">
                 <button 
                  onClick={handleLowPowerToggle}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${isLowPowerMode ? 'bg-orange-600 border-orange-400' : 'bg-slate-800 border-white/5'}`}
                 >
                    <div className="flex items-center gap-3">
                       <i className={`fas fa-leaf ${isLowPowerMode ? 'text-white' : 'text-lime-500'}`}></i>
                       <div className="text-left">
                          <p className={`text-xs font-black uppercase ${isLowPowerMode ? 'text-white' : 'text-slate-200'}`}>Low Power Mode</p>
                          <p className="text-[8px] font-bold text-slate-500 uppercase">Suspend background logic</p>
                       </div>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${isLowPowerMode ? 'bg-white/20' : 'bg-slate-700'}`}>
                       <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${isLowPowerMode ? 'left-5.5' : 'left-0.5'}`}></div>
                    </div>
                 </button>

                 <div className="space-y-2 px-1">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                       <span>Neural Brightness</span>
                       <span>{brightness}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" 
                      value={brightness} 
                      onChange={(e) => setBrightness(parseInt(e.target.value))}
                      className="w-full accent-lime-500 bg-slate-800 h-1.5 rounded-full appearance-none cursor-pointer"
                    />
                 </div>

                 <button 
                  onClick={() => setGpsActive(!gpsActive)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${gpsActive ? 'bg-slate-800 border-white/5' : 'bg-red-950/40 border-red-500/30'}`}
                 >
                    <div className="flex items-center gap-3">
                       <i className={`fas fa-location-crosshairs ${gpsActive ? 'text-blue-500' : 'text-red-500'}`}></i>
                       <div className="text-left">
                          <p className="text-xs font-black uppercase tracking-tighter">Robo-GPS Tracker</p>
                          <p className="text-[8px] font-bold text-slate-500 uppercase">{gpsActive ? 'Active Scan' : 'Suspended for Power'}</p>
                       </div>
                    </div>
                    <span className={`text-[8px] font-black uppercase ${gpsActive ? 'text-blue-400' : 'text-red-500'}`}>{gpsActive ? 'ON' : 'OFF'}</span>
                 </button>
              </div>

              <div className="pt-4 border-t border-white/5">
                 <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed mb-4">Enabling Low Power Mode and reducing brightness can extend your battery by <span className="text-lime-400">4.5 hours</span>.</p>
                 <button onClick={handleLowPowerToggle} className="w-full py-4 bg-lime-600 hover:bg-lime-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-lime-600/20 active:scale-95 transition-all">Optimize Node Life</button>
              </div>
            </div>

            {/* Neural Patterns */}
            <div className="bg-slate-900/50 p-8 rounded-[40px] border border-white/5 space-y-6">
               <h4 className="text-sm font-black uppercase tracking-tight flex items-center gap-3">
                 <i className="fas fa-brain text-purple-500"></i> Usage Patterns
               </h4>
               
               <div className="flex items-end justify-between h-32 px-2 gap-1">
                 {patterns.map(p => (
                   <div key={p.day} className="flex flex-col items-center gap-2 flex-1">
                      <div 
                        className="w-full bg-slate-800 rounded-t-lg transition-all duration-1000 hover:bg-lime-500 relative group cursor-pointer" 
                        style={{ height: `${p.usage}%` }}
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-2 py-0.5 rounded text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                           {p.usage}%
                         </div>
                      </div>
                      <span className="text-[9px] font-black text-slate-600">{p.day}</span>
                   </div>
                 ))}
               </div>

               <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-moon text-purple-400 text-xs"></i>
                    <p className="text-[10px] font-black uppercase text-purple-400">Night Drain Detected</p>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-relaxed uppercase font-bold">You always drain fast at night. The system suggests enabling <span className="text-white">Deep Sleep Node</span> after 11:00 PM to save 12% capacity.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Status Bar */}
      <div className="h-16 bg-slate-900/90 backdrop-blur-2xl border-t border-white/5 px-10 flex items-center justify-between z-30">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse shadow-[0_0_8px_#84cc16]"></span>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Power Grid: {isCharging ? 'Syncing (DC)' : 'Isolated (Cell)'}</p>
          </div>
          <div className="w-[1px] h-4 bg-slate-800"></div>
          <div className="flex items-center gap-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Temp: 34°C (Normal)</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <p className="text-[10px] font-black text-lime-500 uppercase tracking-[0.2em]">Energy Matrix v2.4 Active</p>
        </div>
      </div>
    </div>
  );
};

export default BatteryModule;
