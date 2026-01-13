
import React, { useState } from 'react';

interface GPSModuleProps {
  onBack: () => void;
}

const GPSModule: React.FC<GPSModuleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'MAP' | 'SECURITY' | 'TRAFFIC'>('MAP');

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col">
      <div className="p-4 flex items-center gap-4 bg-slate-900 border-b border-slate-800">
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full"><i className="fas fa-arrow-left"></i></button>
        <h2 className="text-xl font-bold">Aegis GPS Navigation</h2>
      </div>

      <div className="flex-1 relative bg-slate-800">
        {/* Simulated Map */}
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1000/1000')] bg-cover opacity-50 contrast-125 saturate-50"></div>
        
        {/* Radar Effect for Security */}
        {activeTab === 'SECURITY' && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <div className="w-[500px] h-[500px] border-2 border-red-500/30 rounded-full animate-ping"></div>
            <div className="w-[300px] h-[300px] border-2 border-red-500/50 rounded-full animate-[pulse_3s_infinite]"></div>
            <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_red] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_red] animate-pulse"></div>
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button onClick={() => setActiveTab('MAP')} className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-colors ${activeTab === 'MAP' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'}`}><i className="fas fa-layer-group"></i></button>
          <button onClick={() => setActiveTab('SECURITY')} className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-colors ${activeTab === 'SECURITY' ? 'bg-red-600 text-white' : 'bg-slate-900 text-slate-400'}`}><i className="fas fa-user-secret"></i></button>
          <button onClick={() => setActiveTab('TRAFFIC')} className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-colors ${activeTab === 'TRAFFIC' ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400'}`}><i className="fas fa-car"></i></button>
        </div>

        {/* Info Panel */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl">
            {activeTab === 'MAP' && (
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-600/20 rounded-2xl"><i className="fas fa-location-dot text-blue-500"></i></div>
                  <div>
                    <h4 className="font-bold">Current Location</h4>
                    <p className="text-xs text-slate-400">Silicon Valley, CA, United States</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input placeholder="Search destination..." className="flex-1 bg-slate-800 border-none rounded-xl px-4 text-sm" />
                  <button className="px-6 py-3 bg-blue-600 rounded-xl font-bold">Go</button>
                </div>
              </div>
            )}
            {activeTab === 'SECURITY' && (
              <div className="text-center">
                <h4 className="text-red-500 font-bold mb-2">HIDDEN CAMERA SCANNER</h4>
                <p className="text-xs text-slate-300">Scanning 4 blocks radius... 2 suspicious devices detected.</p>
                <div className="mt-4 flex justify-center gap-8">
                  <div className="text-center"><span className="text-2xl font-bold">2</span><p className="text-[10px] text-slate-500">DEVICES</p></div>
                  <div className="text-center text-red-400"><span className="text-2xl font-bold">HIGH</span><p className="text-[10px] text-slate-500">ACCURACY</p></div>
                </div>
              </div>
            )}
            {activeTab === 'TRAFFIC' && (
              <div>
                <h4 className="text-orange-500 font-bold mb-2">LIVE TRAFFIC ANALYSIS</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-800 p-2 rounded-lg">
                    <span className="text-xs">Main St. Block 5</span>
                    <span className="text-xs px-2 py-0.5 bg-red-900/50 text-red-400 rounded">Heavy</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-800 p-2 rounded-lg">
                    <span className="text-xs">Robo Blvd. Block 2</span>
                    <span className="text-xs px-2 py-0.5 bg-green-900/50 text-green-400 rounded">Clear</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPSModule;
