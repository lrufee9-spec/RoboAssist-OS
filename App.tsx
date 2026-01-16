import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
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

// Firebase Configuration using Vite Environment Variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Safety initialization to prevent black screen
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

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
    const newAlert: SecurityAlert = { ...alert, id: Date.now().toString(), timestamp: new Date() };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    if (lower.includes('open camera')) setActiveModule(ModuleType.CAMERA);
    else if (lower.includes('go home')) setActiveModule(ModuleType.HOME);
    else if (lower.includes('open ai chat') || lower.includes('assistant')) setActiveModule(ModuleType.AI_CHAT);
    else if (lower.includes('emergency')) addAlert({ type: 'EMERGENCY', severity: 'high', message: 'Voice triggered emergency protocol.' });
  };

  if (!isAuthenticated) {
    return <Login onLogin={(userData) => { setUser(userData); setIsAuthenticated(true); }} />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case ModuleType.PROFILE: return <ProfileModule user={user!} onBack={() => setActiveModule(ModuleType.HOME)} onLogout={() => setIsAuthenticated(false)} />;
      case ModuleType.AI_CHAT: return <AIChatModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.CHAT: return <ChatModule onBack={() => setActiveModule(ModuleType.HOME)} />;
      case ModuleType.BATTERY: return <BatteryModule batteryLevel={batteryLevel} isCharging={isCharging} onBack={() => setActiveModule(ModuleType.HOME)} />;
      default: return <Desktop onOpenModule={(mod) => setActiveModule(mod)} batteryLevel={batteryLevel} isCharging={isCharging} />;
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-black overflow-hidden safe-top">
      <div className="flex-1 relative overflow-hidden">
        {renderModule()}
        {alerts.length > 0 && alerts[0].severity === 'high' && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center p-6 bg-red-950/60 backdrop-blur-md">
            <div className="bg-red-600 p-8 rounded-[40px] text-white text-center">
              <h3 className="text-3xl font-black uppercase">{alerts[0].type} ALERT</h3>
              <p className="mt-2">{alerts[0].message}</p>
              <button onClick={() => setAlerts([])} className="mt-6 px-8 py-3 bg-white text-red-600 rounded-full font-bold">Acknowledge</button>
            </div>
          </div>
        )}
      </div>
      <RobotAssistant robotName={user?.robotName || "AlphaBot"} onCommand={handleCommand} onDistress={(msg) => addAlert({ type: 'THREAT', severity: 'high', message: msg })} />
    </div>
  );
};

export default App;
// Deploying Neural Core v1.1
