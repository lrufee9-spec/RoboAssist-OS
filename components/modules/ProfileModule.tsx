
import React, { useState } from 'react';
import { User } from '../../types';

interface ProfileModuleProps {
  user: User;
  onBack: () => void;
  onLogout: () => void;
}

const ProfileModule: React.FC<ProfileModuleProps> = ({ user, onBack, onLogout }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  const handleResetPassword = () => {
    setShowResetSuccess(true);
    setTimeout(() => {
      setShowResetSuccess(false);
      setShowPasswordModal(false);
    }, 3000);
  };

  return (
    <div className="w-full h-full bg-slate-950 p-6 flex flex-col overflow-y-auto relative">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack} 
          className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-full transition-colors border border-white/10"
          aria-label="Back to Desktop"
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h2 className="text-2xl font-black tracking-tight uppercase">User Profile & Security</h2>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full space-y-8 pb-12">
        {/* Profile Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-blue-600/20 transition-all duration-1000"></div>
          
          <div className="relative">
            <div className="w-44 h-44 rounded-[32px] overflow-hidden border-4 border-blue-500 shadow-2xl ring-4 ring-blue-500/20">
              <img src={user.avatar} className="w-full h-full object-cover" alt="User Avatar" />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-slate-900 shadow-lg">
              <i className="fas fa-user-shield text-white"></i>
            </div>
          </div>

          <div className="text-center md:text-left flex-1 z-10">
            <h3 className="text-4xl font-black mb-1 tracking-tighter text-white">{user.name}</h3>
            <p className="text-blue-400 font-bold uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2 justify-center md:justify-start">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Neural-Link Active with {user.robotName}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors">
                <span className="text-[9px] text-slate-500 block uppercase font-black mb-1 tracking-widest">Account Balance</span>
                <span className="text-2xl font-black text-green-400">${user.balance.toLocaleString()}</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-colors">
                <span className="text-[9px] text-slate-500 block uppercase font-black mb-1 tracking-widest">Security Level</span>
                <span className="text-2xl font-black text-blue-500">Tier 5</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/5 hidden md:block hover:border-blue-500/30 transition-colors">
                <span className="text-[9px] text-slate-500 block uppercase font-black mb-1 tracking-widest">Uptime</span>
                <span className="text-2xl font-black text-purple-400">99.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Password Section */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-4">System Access & Security</h4>
          <div className="bg-slate-900/50 rounded-[40px] border border-white/5 overflow-hidden shadow-xl">
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-800 transition-all border-b border-white/5 group"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <i className="fas fa-key text-xl"></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-base text-white">Change Access Password</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Update your manual entry credentials</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-slate-700 group-hover:translate-x-1 transition-transform"></i>
            </button>

            <button className="w-full flex items-center justify-between p-6 hover:bg-slate-800 transition-all border-b border-white/5 group">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <i className="fas fa-fingerprint text-xl"></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-base text-white">Biometric Configuration</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Fingerprint & Face ID vault settings</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-slate-700 group-hover:translate-x-1 transition-transform"></i>
            </button>

            <button 
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-800 transition-all border-b border-white/5 group"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <i className="fas fa-unlock-keyhole text-xl"></i>
                </div>
                <div className="text-left">
                  <p className="font-black text-base text-white">Lost Password Recovery</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Emergency robot-assisted account recovery</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-slate-700 group-hover:translate-x-1 transition-transform"></i>
            </button>

            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-between p-6 hover:bg-red-600 text-white transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center text-red-500 group-hover:text-white transition-colors">
                  <i className="fas fa-power-off text-xl"></i>
                </div>
                <p className="font-black text-base uppercase tracking-widest">Logout & Kill Sessions</p>
              </div>
            </button>
          </div>
        </div>

        {/* Robot Friends Section - Preserved from previous turn */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Neural Network Neighbors</h4>
            <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full uppercase">Synced World-Wide</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.robotFriends?.map(friend => (
              <div key={friend.id} className="bg-slate-900/50 p-6 rounded-[32px] border border-white/5 flex items-center gap-4 group hover:bg-slate-800 transition-all cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
                  <i className="fas fa-robot text-white"></i>
                </div>
                <div className="flex-1">
                  <h5 className="font-black text-white text-lg">{friend.name}</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Owner: {friend.ownerName} • {friend.location}</p>
                </div>
                <i className="fas fa-comment-nodes text-slate-700 group-hover:text-blue-500 transition-colors text-xl"></i>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Password Management Modal Simulation */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 w-full max-w-md p-8 rounded-[40px] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black uppercase tracking-tight text-white">Secure Reset</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-500 hover:text-white"><i className="fas fa-times text-xl"></i></button>
            </div>

            {showResetSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <i className="fas fa-check text-4xl text-green-500 animate-bounce"></i>
                </div>
                <h4 className="text-xl font-bold">Protocol Executed</h4>
                <p className="text-slate-400 text-sm">Your access credentials have been synchronized across all RoboAssist nodes.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">New Neural Passkey</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Confirm Passkey</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  Tip: Use your robot companion to store this key in the encrypted local vault for biometric auto-fill.
                </p>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-4 bg-slate-800 rounded-2xl text-sm font-bold text-white hover:bg-slate-750 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleResetPassword}
                    className="flex-1 py-4 bg-blue-600 rounded-2xl text-sm font-black text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                  >
                    Apply Update
                  </button>
                </div>
                <button className="w-full py-2 text-xs font-bold text-slate-500 hover:text-blue-400 transition-colors">Forgot your old password? Start recovery.</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModule;
