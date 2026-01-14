import React, { useState, useEffect } from 'react';
// --- Firebase Neural Core Imports ---
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// ------------------------------------
import { ModuleType, User, SecurityAlert } from './types';
import Login from './components/Login';
import Desktop from './components/Desktop';
import RobotAssistant from './components/RobotAssistant';
import ProfileModule from './components/modules/ProfileModule';
import AIChatModule from './components/modules/AIChatModule';
import ChatModule from './components/modules/ChatModule';
import ContentModule from './components/modules/ContentModule';
import InboxModule from './components/modules/InboxModule';
import VideoModule from './components/modules/VideoModule';
import BooksModule from './components/modules/BooksModule';
import FilesModule from './components/modules/FilesModule';
import ControllerModule from './components/modules/ControllerModule';
import GPSModule from './components/modules/GPSModule';
import CameraModule from './components/modules/CameraModule';
import StorageModule from './components/modules/StorageModule';
import TerminalModule from './components/modules/TerminalModule';
import ExtensionsModule from './components/modules/ExtensionsModule';
import BatteryModule from './components/modules/BatteryModule';

// --- Firebase Configuration & Initialization ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Start the Neural Brain
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
// ----------------------------------------------

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.HOME);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isCharging, setIsCharging] = useState(false);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);

  useEffect(() => {
    const updateBattery = (battery: any) => {
      setBatteryLevel(battery.level * 100);
      setIsCharging(battery.charging);
      if (battery.level <= 0.2 && !battery.charging) {
        addAlert({ 
          type: 'BATTERY', 
          severity: 'high', 
          message: 'Battery Critical (20%). Please enable Low Power Mode.' 
        });
      }
    };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        updateBattery(battery);
        battery.addEventListener('levelchange', () => updateBattery(battery));
        battery.addEventListener('chargingchange', () => updateBattery(battery));
      });
    }
  }, []);

  const addAlert = (alert: Omit<SecurityAlert, 'id' | 'timestamp'>) => {
    const newAlert: SecurityAlert = {
      ...alert,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    if (lower.includes('open camera')) setActiveModule(ModuleType.CAMERA);
    else if (lower.includes('go home') || lower.includes('show desktop')) setActiveModule(ModuleType.HOME);
    else if (lower.includes('open gps') || lower.includes('map')) setActiveModule(ModuleType.GPS);
    else if (lower.includes('open chat')) setActiveModule(ModuleType.CHAT);
    else if (lower.includes('open ai chat') || lower.includes('assistant')) setActiveModule(ModuleType.AI_CHAT);
    else if (lower.includes('open files')) setActiveModule(ModuleType.FILES);
    else if (lower.includes('open battery')) setActiveModule(ModuleType.BATTERY);
    else if (lower.includes('emergency') || lower.includes('help me')) {
      addAlert({ type: 'EMERGENCY', severity: 'high', message: 'Voice triggered emergency protocol.' });
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={(userData) => { setUser(userData); setIsAuthenticated(true); }} />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case ModuleType.PROFILE: return <ProfileModule user={user!} onBack={() => setActiveModule(ModuleType.HOME)} onLogout={() => setIsAuthenticated(false)} />;
      case ModuleType.AI_CHAT: return <AIChatModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.CHAT: return <ChatModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.CONTENT: return <ContentModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.INBOX: return <InboxModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.VIDEO: return <VideoModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.BOOKS: return <BooksModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.FILES: return <FilesModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.CONTROLLER: return <ControllerModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.GPS: return <GPSModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.CAMERA: return <CameraModule onBack={() => setActiveModule(ModuleType.HOME)} onAlert={addAlert} />;
      case ModuleType.STORAGE: return <StorageModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.TERMINAL: return <TerminalModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.EXTENSIONS: return <ExtensionsModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.BATTERY: return <BatteryModule batteryLevel={batteryLevel} isCharging={isCharging} onBack={() => setActiveModule(ModuleType.HOME)} />;
      default: return <Desktop onOpenModule={(mod) => setActiveModule(mod)} batteryLevel={batteryLevel} isCharging={isCharging} />;
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-black overflow-hidden safe-top">
      <div className="flex-1 relative overflow-hidden">
        {renderModule()}
        
        {/* Urgent Alert Modal */}
        {alerts.length > 0 && alerts[0].severity === 'high' && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center p-6 bg-red-950/60 backdrop-blur-md">
            <div className="bg-red-600 w-full max-w-sm p-8 rounded-[40px] shadow-2xl border-4 border-red-400 animate-in zoom-in-95 duration-300">
              <div className="flex flex-col items-center text-center space-y-6">
                <i className="fas fa-triangle-exclamation text-7xl text-white animate-bounce"></i>
                <div>
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{alerts[0].type} ALERT</h3>
                  <p className="text-sm font-bold text-red-100 mt-2">{alerts[0].message}</p>
                </div>
                <div className="flex flex-col w-full gap-3 pt-4">
                  <button onClick={() => setAlerts([])} className="w-full py-4 bg-white text-red-600 rounded-3xl font-black uppercase text-xs">Acknowledge</button>
                  <button className="w-full py-4 bg-black/20 text-white rounded-3xl font-black uppercase text-xs">Emergency Call</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      {(activeModule === ModuleType.HOME || activeModule === ModuleType.PROFILE || activeModule === ModuleType.AI_CHAT || activeModule === ModuleType.INBOX) && (
        <div className="h-20 bg-slate-950 border-t border-white/5 flex items-center justify-around px-4 safe-bottom z-[90]">
          <button onClick={() => setActiveModule(ModuleType.HOME)} className={`flex flex-col items-center gap-1 ${activeModule === ModuleType.HOME ? 'text-blue-500' : 'text-slate-500'}`}>
            <i className="fas fa-house text-xl"></i>
            <span className="text-[10px] font-black uppercase">Home</span>
          </button>
          <button onClick={() => setActiveModule(ModuleType.AI_CHAT)} className={`flex flex-col items-center gap-1 ${activeModule === ModuleType.AI_CHAT ? 'text-indigo-500' : 'text-slate-500'}`}>
            <i className="fas fa-robot text-xl"></i>
            <span className="text-[10px] font-black uppercase">Assistant</span>
          </button>
          <button onClick={() => setActiveModule(ModuleType.INBOX)} className={`flex flex-col items-center gap-1 ${activeModule === ModuleType.INBOX ? 'text-red-500' : 'text-slate-500'}`}>
            <i className="fas fa-envelope text-xl"></i>
            <span className="text-[10px] font-black uppercase">Inbox</span>
          </button>
          <button onClick={() => setActiveModule(ModuleType.PROFILE)} className={`flex flex-col items-center gap-1 ${activeModule === ModuleType.PROFILE ? 'text-teal-500' : 'text-slate-500'}`}>
            <i className="fas fa-user-circle text-xl"></i>
            <span className="text-[10px] font-black uppercase">Profile</span>
          </button>
        </div>
      )}

      {/* Persistent Assistant Controller */}
      <RobotAssistant 
        robotName={user?.robotName || "AlphaBot"} 
        onCommand={handleCommand}
        onDistress={(msg) => addAlert({ type: 'THREAT', severity: 'high', message: msg })}
      />
    </div>
  );
};

export default App;
