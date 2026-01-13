
import React, { useRef, useState, useEffect } from 'react';
import { analyzeSafety } from '../../services/geminiService';
import { SecurityAlert } from '../../types';

interface CameraModuleProps {
  onBack: () => void;
  onAlert: (alert: Omit<SecurityAlert, 'id' | 'timestamp'>) => void;
}

const CameraModule: React.FC<CameraModuleProps> = ({ onBack, onAlert }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isShuttering, setIsShuttering] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [threatStatus, setThreatStatus] = useState<{ level: string; msg: string; type: string }>({ level: 'low', msg: 'Area Secure', type: 'none' });
  
  // Camera Settings
  const [activeFilter, setActiveFilter] = useState('none');
  const [showSettings, setShowSettings] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [resolution, setResolution] = useState<'HD' | '4K'>('HD');

  useEffect(() => {
    startCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error(err);
    }
  };

  const takePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    setIsShuttering(true);
    setTimeout(() => setIsShuttering(false), 150);

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      setCapturedPhotos(prev => [dataUrl, ...prev].slice(0, 5));
      
      // Simulate sync to Files
      console.log("Syncing to Neural Filesystem...");
    }
  };

  const runSafetyCheck = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    setIsScanning(true);
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      canvasRef.current.width = 640;
      canvasRef.current.height = 480;
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      const base64 = canvasRef.current.toDataURL('image/jpeg').split(',')[1];
      
      const result = await analyzeSafety(base64);
      const newStatus = { 
        level: result.threatLevel, 
        msg: result.action === 'emergency_alert' ? 'THREAT IDENTIFIED' : 'Environment Monitored',
        type: result.threatType
      };
      
      setThreatStatus(newStatus);
      
      if (result.threatLevel === 'high' || result.action === 'emergency_alert') {
        onAlert({
          type: 'VIOLENCE',
          severity: 'high',
          message: `Visual threat detected: ${result.threatType}`
        });
      }
    }
    
    setIsScanning(false);
  };

  const filters: Record<string, string> = {
    none: '',
    thermal: 'sepia(1) saturate(5) hue-rotate(90deg) contrast(1.5)',
    night: 'invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.2)',
    cyber: 'hue-rotate(280deg) saturate(2) brightness(1.1)',
    mono: 'grayscale(1) contrast(1.3)'
  };

  return (
    <div className="w-full h-full bg-black flex flex-col relative overflow-hidden font-sans text-white">
      {/* Shutter Animation Overlay */}
      {isShuttering && <div className="absolute inset-0 z-[100] bg-white animate-out fade-out duration-150"></div>}
      {flashEnabled && isShuttering && <div className="absolute inset-0 z-[101] bg-white opacity-80"></div>}

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/20 to-transparent">
        <button onClick={onBack} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-90">
          <i className="fas fa-arrow-left text-white text-xl"></i>
        </button>

        <div className="flex gap-4">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 backdrop-blur-xl border border-white/20 ${threatStatus.level === 'high' ? 'bg-red-600 animate-pulse text-white' : 'bg-blue-600/40 text-blue-400'}`}>
            <span className={`w-2 h-2 rounded-full ${threatStatus.level === 'high' ? 'bg-white' : 'bg-blue-400'} animate-pulse`}></span>
            ROBOSCAN {threatStatus.level === 'high' ? 'ALARM' : 'ACTIVE'}
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${showSettings ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/10 backdrop-blur-md hover:bg-white/20'}`}
          >
            <i className="fas fa-sliders"></i>
          </button>
        </div>
      </div>

      {/* Camera Viewport */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-950 overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          style={{ filter: filters[activeFilter] }}
          className={`w-full h-full object-cover transition-all duration-1000 ${threatStatus.level === 'high' ? 'scale-105' : 'scale-100'}`} 
        />
        
        {/* Viewport Grid Lines */}
        {gridEnabled && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border-[0.5px] border-white/10"></div>
            ))}
          </div>
        )}

        {/* Robotic HUD Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner Brackets */}
          <div className="absolute top-12 left-12 w-32 h-32 border-t-2 border-l-2 border-blue-500/50"></div>
          <div className="absolute top-12 right-12 w-32 h-32 border-t-2 border-r-2 border-blue-500/50"></div>
          <div className="absolute bottom-12 left-12 w-32 h-32 border-b-2 border-l-2 border-blue-500/50"></div>
          <div className="absolute bottom-12 right-12 w-32 h-32 border-b-2 border-r-2 border-blue-500/50"></div>

          {/* Compass/Pitch Roll Display */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 space-y-4 text-[8px] font-black text-blue-500/40 uppercase tracking-widest hidden lg:block">
            <div className="flex items-center gap-2">
              <div className="w-1 h-20 bg-blue-500/10 rounded-full relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 w-3 h-0.5 bg-blue-500"></div>
              </div>
              PITCH
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-20 bg-blue-500/10 rounded-full relative">
                <div className="absolute top-1/3 left-0 w-3 h-0.5 bg-blue-500"></div>
              </div>
              YAW
            </div>
          </div>

          {/* Target Box (Center) */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 transition-all duration-300 ${threatStatus.level === 'high' ? 'border-red-500 scale-110 shadow-[0_0_50px_rgba(239,68,68,0.3)]' : 'border-blue-500/30 scale-100'}`}>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-blue-500 text-[8px] px-2 py-0.5 font-bold">FOCUS_V5</div>
            {isScanning && <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>}
            
            {/* Corner Details */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500"></div>
          </div>

          {/* Scanning Bar */}
          {isScanning && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400 shadow-[0_0_20px_blue] animate-[scan_2s_linear_infinite] z-20"></div>
          )}

          {/* Status Overlay */}
          <div className="absolute bottom-32 left-8 right-8 flex justify-between items-end">
            <div className={`p-6 rounded-[32px] backdrop-blur-xl border border-white/10 max-w-sm transition-all duration-500 ${threatStatus.level === 'high' ? 'bg-red-950/80 border-red-500' : 'bg-slate-900/80'}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">AI Perception Core</span>
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <h4 className={`text-2xl font-black mb-1 ${threatStatus.level === 'high' ? 'text-red-500' : 'text-white'}`}>{threatStatus.msg}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">DETECTION: {threatStatus.type || 'ENVIRONMENTAL SCAN'}</p>
            </div>

            <div className="flex flex-col items-end gap-4">
              {capturedPhotos.length > 0 && (
                <div className="relative group cursor-pointer" onClick={() => alert("Syncing to Files Hub...")}>
                  <img src={capturedPhotos[0]} className="w-20 h-20 rounded-2xl border-2 border-white/20 object-cover shadow-2xl" alt="" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] border-2 border-slate-900 font-black">{capturedPhotos.length}</div>
                </div>
              )}
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-right">
                <p className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Coordinates</p>
                <p className="text-xs font-black text-blue-400">37.7749° N, 122.4194° W</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Edit Camera" Settings Panel */}
      {showSettings && (
        <div className="absolute right-6 top-24 z-50 w-64 bg-slate-900/90 backdrop-blur-2xl rounded-[40px] border border-white/10 p-6 space-y-8 animate-in slide-in-from-right-10 shadow-2xl">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Vision Filters</h4>
              <div className="grid grid-cols-2 gap-2">
                 {Object.keys(filters).map(f => (
                   <button 
                    key={f} 
                    onClick={() => setActiveFilter(f)}
                    className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${activeFilter === f ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-white/5 text-slate-500'}`}
                   >
                     {f}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hardware Node Settings</h4>
              <div className="space-y-3">
                 <button onClick={() => setFlashEnabled(!flashEnabled)} className="w-full flex justify-between items-center p-3 bg-slate-800 rounded-xl">
                    <span className="text-xs font-bold"><i className={`fas fa-bolt mr-2 ${flashEnabled ? 'text-yellow-400' : 'text-slate-600'}`}></i> Neural Flash</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${flashEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}>
                       <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${flashEnabled ? 'left-5.5' : 'left-0.5'}`}></div>
                    </div>
                 </button>
                 <button onClick={() => setGridEnabled(!gridEnabled)} className="w-full flex justify-between items-center p-3 bg-slate-800 rounded-xl">
                    <span className="text-xs font-bold"><i className="fas fa-table-cells mr-2 text-slate-600"></i> Frame Grid</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${gridEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}>
                       <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${gridEnabled ? 'left-5.5' : 'left-0.5'}`}></div>
                    </div>
                 </button>
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Broadcast Resolution</h4>
              <div className="flex gap-2">
                 <button onClick={() => setResolution('HD')} className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${resolution === 'HD' ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-white/5 text-slate-500'}`}>HD</button>
                 <button onClick={() => setResolution('4K')} className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${resolution === '4K' ? 'bg-blue-600 border-blue-400' : 'bg-slate-800 border-white/5 text-slate-500'}`}>4K SYNC</button>
              </div>
           </div>
        </div>
      )}

      {/* Shutter Bar */}
      <div className="h-44 bg-slate-900/90 backdrop-blur-2xl border-t border-white/5 flex items-center justify-center gap-12 px-10 relative z-30">
        <button className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center text-slate-500 hover:text-blue-500 transition-all">
          <i className="fas fa-rotate text-xl"></i>
        </button>

        <button 
          onClick={takePhoto}
          className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-90 transition-all group"
        >
          <div className="w-20 h-20 rounded-full border-4 border-slate-900 flex items-center justify-center">
             <div className="w-14 h-14 bg-slate-950 rounded-full flex items-center justify-center">
                <i className="fas fa-camera text-2xl text-white"></i>
             </div>
          </div>
        </button>

        <button 
          onClick={runSafetyCheck}
          disabled={isScanning}
          className={`w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center transition-all ${isScanning ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-800 text-slate-500 hover:text-blue-500'}`}
        >
          <i className={`fas ${isScanning ? 'fa-fingerprint' : 'fa-shield-halved'} text-xl`}></i>
        </button>

        {/* Shutter Tooltip */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
          Master Control Hub • Shutter Ready
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default CameraModule;
