
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [robotName, setRobotName] = useState('');
  const [password, setPassword] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [bootStep, setBootStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBootStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: '1',
      name: username || 'User',
      robotName: robotName || 'AlphaBot',
      balance: 1000,
      avatar: 'https://picsum.photos/seed/user/200',
      robotFriends: []
    });
  };

  const handleFingerprint = () => {
    setIsScanning(true);
    // Vibrate to simulate haptic feedback
    if (window.navigator?.vibrate) window.navigator.vibrate(100);
    
    setTimeout(() => {
      setIsScanning(false);
      onLogin({
        id: '1',
        name: 'Biometric Admin',
        robotName: 'CyberGuard',
        balance: 2500,
        avatar: 'https://picsum.photos/seed/bio/200',
        robotFriends: []
      });
    }, 1800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-6 safe-top safe-bottom">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-sm z-10 space-y-12">
        {/* System Branding */}
        <div className="text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-slate-800 to-slate-950 rounded-[32px] border border-white/10 flex items-center justify-center shadow-2xl">
              <i className="fas fa-robot text-5xl text-blue-500"></i>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-black flex items-center justify-center">
              <i className="fas fa-bolt text-[10px] text-white"></i>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">RoboAssist <span className="text-blue-500">OS</span></h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Personal Assistance v5.0</p>
        </div>

        {/* Boot Sequence / Status */}
        <div className="space-y-2 px-4">
          <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-600">
            <span>Neural Link</span>
            <span className={bootStep >= 1 ? 'text-green-500' : ''}>{bootStep >= 1 ? 'Established' : 'Scanning...'}</span>
          </div>
          <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className={`h-full bg-blue-600 transition-all duration-1000 ease-out shadow-[0_0_10px_#2563eb]`} style={{ width: `${(bootStep / 3) * 100}%` }}></div>
          </div>
        </div>

        {/* Interaction Form */}
        <div className="bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[40px] border border-white/5 shadow-2xl space-y-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {isRegistering && (
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Assistant Designation</label>
                <input 
                  type="text" 
                  value={robotName}
                  onChange={(e) => setRobotName(e.target.value)}
                  className="w-full px-6 py-4 bg-black/40 border border-white/5 rounded-3xl text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all" 
                  placeholder="e.g. AlphaBot-V1"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Neural Identity</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 bg-black/40 border border-white/5 rounded-3xl text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all" 
                placeholder="Username"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Passkey</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-black/40 border border-white/5 rounded-3xl text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all" 
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 transition-all text-white font-black rounded-3xl text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 active:scale-95"
            >
              {isRegistering ? 'Register Node' : 'Initialize Session'}
            </button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/5"></div>
            <span className="flex-shrink mx-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Biometric Auth</span>
            <div className="flex-grow border-t border-white/5"></div>
          </div>

          {/* Biometric Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handleFingerprint}
              disabled={isScanning}
              className={`flex flex-col items-center justify-center p-6 bg-black/40 rounded-[32px] border transition-all active:scale-95 ${isScanning ? 'border-blue-500 bg-blue-600/5' : 'border-white/5 hover:border-white/10'}`}
            >
              <div className="relative">
                <i className={`fas fa-fingerprint text-3xl mb-3 ${isScanning ? 'text-blue-500' : 'text-slate-500'}`}></i>
                {isScanning && (
                  <div className="absolute inset-0 bg-blue-400 blur-lg opacity-40 animate-pulse"></div>
                )}
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Fingerprint</span>
            </button>
            <button 
              className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-[32px] border border-white/5 hover:border-white/10 transition-all active:scale-95"
            >
              <i className="fas fa-face-smile text-3xl mb-3 text-slate-500"></i>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Face ID</span>
            </button>
          </div>
        </div>

        {/* Footer Toggle */}
        <p className="text-center">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            {isRegistering ? 'Already have a profile?' : 'New assistant owner?'}
          </span>
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="ml-2 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline underline-offset-4"
          >
            {isRegistering ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>

      {/* Floating Scanning HUD */}
      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in">
           <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
              <div className="text-center space-y-4">
                 <i className="fas fa-fingerprint text-7xl text-blue-500 animate-pulse"></i>
                 <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Verifying Identity...</p>
              </div>
              {/* Scan Bar Animation */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400 shadow-[0_0_15px_#60a5fa] animate-[scan_2s_linear_infinite] rounded-full"></div>
           </div>
        </div>
      )}

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

export default Login;
