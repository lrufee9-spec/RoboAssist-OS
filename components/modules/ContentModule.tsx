
import React, { useState, useEffect } from 'react';

interface ContentModuleProps {
  onBack: () => void;
}

interface SocialPost {
  id: string;
  user: string;
  avatar: string;
  type: 'image' | 'video';
  mediaUrl: string;
  caption: string;
  likes: number;
  isFollowing: boolean;
}

const ContentModule: React.FC<ContentModuleProps> = ({ onBack }) => {
  const [view, setView] = useState<'feed' | 'live' | 'gaming'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [speakerTimer, setSpeakerTimer] = useState(120); // 2 minute speaker limit
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pendingDonation, setPendingDonation] = useState(0);

  const [posts, setPosts] = useState<SocialPost[]>([
    { 
      id: 'p1', 
      user: 'RoboMaster_99', 
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=RoboMaster_99',
      type: 'video', 
      mediaUrl: 'https://picsum.photos/seed/v1/600/400', 
      caption: 'My latest 2-minute adventure in the silicon valley.', 
      likes: 1240, 
      isFollowing: true 
    },
    { 
      id: 'p2', 
      user: 'CyberArtist', 
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberArtist',
      type: 'image', 
      mediaUrl: 'https://picsum.photos/seed/p2/600/400', 
      caption: 'Visualizing the neural network of a friend.', 
      likes: 850, 
      isFollowing: false 
    },
  ]);

  // Speaker Timer Logic
  useEffect(() => {
    let interval: number;
    if (isSpeaking && speakerTimer > 0) {
      interval = window.setInterval(() => {
        setSpeakerTimer(prev => prev - 1);
      }, 1000);
    } else if (speakerTimer === 0 && isSpeaking) {
      handleStopSpeaking(false); // Speaker refused/timed out
    }
    return () => clearInterval(interval);
  }, [isSpeaking, speakerTimer]);

  const handleStopSpeaking = (voluntary: boolean) => {
    setIsSpeaking(false);
    if (voluntary) {
      // Money goes to speaker
      alert(`Speaker finished voluntarily. $${pendingDonation} transferred to speaker account.`);
    } else {
      // Money back to sender
      alert(`Speaker timed out or refused to stop. $${pendingDonation} refunded to sender.`);
    }
    setPendingDonation(0);
    setSpeakerTimer(120);
  };

  const handleDonate = () => {
    if (!isSpeaking) {
      alert("No active speaker to donate to.");
      return;
    }
    setPendingDonation(prev => prev + 50);
    alert("Donation of $50 queued. Will transfer if speaker stops on time.");
  };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col overflow-hidden text-white font-sans">
      {/* Header */}
      <div className="p-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-full border border-white/10 transition-all">
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase tracking-tighter">Social Nexus OS</h2>
        </div>
        
        <div className="flex bg-slate-800 rounded-2xl p-1 gap-1">
          <button onClick={() => setView('feed')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${view === 'feed' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>FEED</button>
          <button onClick={() => setView('live')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${view === 'live' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>LIVE ROOM</button>
          <button onClick={() => setView('gaming')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${view === 'gaming' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>GAMING</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view === 'feed' && (
          <div className="max-w-2xl mx-auto py-8 px-4 space-y-12">
            {/* Search / Discover */}
            <div className="relative group">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
              <input 
                type="text" 
                placeholder="Search users to follow or block..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border-2 border-white/5 rounded-3xl py-4 pl-12 pr-4 text-sm focus:border-blue-500 outline-none transition-all shadow-2xl"
              />
            </div>

            {/* Posts */}
            {posts.map(post => (
              <div key={post.id} className="bg-slate-900 rounded-[40px] border border-white/10 shadow-2xl overflow-hidden group">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={post.avatar} className="w-12 h-12 rounded-2xl bg-slate-800 p-1 border border-white/10 shadow-lg" alt="" />
                    <div>
                      <h4 className="font-black text-sm">{post.user}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Citizen</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setPosts(posts.map(p => p.id === post.id ? { ...p, isFollowing: !p.isFollowing } : p))}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${post.isFollowing ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white shadow-lg'}`}
                    >
                      {post.isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 hover:text-red-500"><i className="fas fa-ban text-xs"></i></button>
                  </div>
                </div>

                <div className="relative aspect-video bg-black overflow-hidden group/media">
                  <img src={post.mediaUrl} className="w-full h-full object-cover opacity-80 group-hover/media:scale-105 transition-transform duration-1000" alt="" />
                  {post.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover/media:scale-110 transition-transform cursor-pointer">
                        <i className="fas fa-play text-2xl text-white"></i>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">2:00 MIN</div>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <p className="text-slate-200 text-sm mb-6 leading-relaxed font-medium">{post.caption}</p>
                  <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <div className="flex gap-8">
                      <button className="flex items-center gap-2 group/btn">
                        <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center group-hover/btn:bg-pink-500/20 transition-all">
                          <i className="fas fa-heart text-pink-500 text-lg"></i>
                        </div>
                        <span className="text-xs font-black text-slate-400">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 group/btn">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover/btn:bg-blue-500/20 transition-all">
                          <i className="fas fa-gift text-blue-500 text-lg"></i>
                        </div>
                        <span className="text-xs font-black text-slate-400">GIFT</span>
                      </button>
                      <button className="flex items-center gap-2 group/btn">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center group-hover/btn:bg-green-500/20 transition-all">
                          <i className="fas fa-share-nodes text-green-500 text-lg"></i>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'live' && (
          <div className="h-full flex flex-col md:flex-row p-6 gap-6">
            {/* Main Stage */}
            <div className="flex-[3] bg-slate-900 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
                <div className="bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                </div>
                <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300">
                  <i className="fas fa-eye mr-2"></i> 14.2k VIEWERS
                </div>
              </div>

              <div className="flex-1 bg-black/60 relative flex items-center justify-center group">
                {/* Active Speaker Area */}
                <div className="text-center space-y-6">
                  {isSpeaking ? (
                    <>
                      <div className="w-48 h-48 rounded-[60px] border-4 border-red-500 p-2 mx-auto relative">
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=SpeakerX" className="w-full h-full object-cover bg-slate-800 rounded-[48px]" alt="" />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-red-600 px-4 py-1 rounded-full text-xs font-black">SPEAKING</div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-4xl font-black">ROBO_SPEAKER_01</h3>
                        <p className="text-red-500 font-black text-2xl tracking-[0.2em]">{Math.floor(speakerTimer / 60)}:{(speakerTimer % 60).toString().padStart(2, '0')}</p>
                      </div>
                      <div className="max-w-md mx-auto p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-2">Queue Donation Balance</p>
                        <p className="text-3xl font-black text-green-400">${pendingDonation}</p>
                      </div>
                    </>
                  ) : (
                    <div className="opacity-40 space-y-4">
                      <i className="fas fa-microphone-slash text-8xl"></i>
                      <h3 className="text-2xl font-black uppercase">Host is selecting next invite</h3>
                      <p className="text-sm">Raise your hand to be invited to speak.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 bg-slate-900/80 backdrop-blur-md border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsHandRaised(!isHandRaised)}
                    className={`px-8 py-3 rounded-2xl font-black uppercase text-xs flex items-center gap-2 transition-all ${isHandRaised ? 'bg-orange-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                  >
                    <i className={`fas ${isHandRaised ? 'fa-hand-peace' : 'fa-hand'} text-lg`}></i> 
                    {isHandRaised ? 'Hand Raised' : 'Raise Hand'}
                  </button>
                  <button 
                    onClick={handleDonate}
                    className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black uppercase text-xs flex items-center gap-2 shadow-lg transition-all"
                  >
                    <i className="fas fa-circle-dollar-to-slot text-lg"></i> Send Gift
                  </button>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setIsSpeaking(true)} className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all" title="Host: Force Invite"><i className="fas fa-plus"></i></button>
                  <button onClick={() => handleStopSpeaking(true)} className="w-12 h-12 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all" title="Stop Speaker"><i className="fas fa-stop"></i></button>
                </div>
              </div>
            </div>

            {/* Live Chat Sidebar */}
            <div className="flex-1 bg-slate-900 rounded-[40px] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h4 className="font-black text-sm uppercase tracking-widest text-slate-500">Live Reactions</h4>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                </div>
              </div>
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex-shrink-0"></div>
                    <div>
                      <span className="text-[10px] font-black text-blue-500 mr-2 uppercase">User_{i * 102}</span>
                      <span className="text-xs text-slate-300 leading-tight">This speech is inspiring! Keep going! 🔥</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-950/50 border-t border-white/5">
                <div className="flex gap-2">
                  <input placeholder="Say something..." className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-2 text-xs" />
                  <button className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><i className="fas fa-paper-plane text-xs"></i></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'gaming' && (
          <div className="p-8 max-w-6xl mx-auto space-y-12">
            {/* Pad Sync Status */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 p-10 rounded-[50px] border border-indigo-500/20 shadow-2xl flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
              <div className="relative">
                <div className="w-48 h-48 rounded-full border-8 border-indigo-500/10 flex items-center justify-center">
                  <i className="fas fa-gamepad text-8xl text-indigo-500 animate-pulse"></i>
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                  <i className="fas fa-check"></i>
                </div>
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-5xl font-black tracking-tighter mb-2">GAME HUB SYNC</h3>
                  <p className="text-indigo-300 font-bold text-sm uppercase tracking-widest">DualSense / Xbox Elite v2 Detected</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Latency</p>
                    <p className="text-2xl font-black text-blue-400">0.8ms</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Global Rank</p>
                    <p className="text-2xl font-black text-purple-400">#1,204</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Lobby */}
            <div className="space-y-6">
              <h4 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <i className="fas fa-globe-americas text-blue-500"></i> Global Matchmaking
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-8 rounded-[40px] border border-white/10 hover:border-blue-500/50 transition-all group cursor-pointer shadow-xl">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 text-4xl group-hover:scale-110 transition-transform">
                      <i className="fas fa-futbol"></i>
                    </div>
                    <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">SOCCER WORLD</span>
                  </div>
                  <h5 className="text-2xl font-black mb-2">ULTIMATE ROBO LEAGUE</h5>
                  <p className="text-sm text-slate-500 mb-8 leading-relaxed">Sync your pad and play soccer against robots worldwide. Seasonal tournament starts in 2 hours.</p>
                  <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20 transition-all">JOIN MATCH</button>
                </div>

                <div className="bg-slate-900 p-8 rounded-[40px] border border-white/10 hover:border-purple-500/50 transition-all group cursor-pointer shadow-xl">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-20 h-20 bg-purple-600/10 rounded-3xl flex items-center justify-center text-purple-500 text-4xl group-hover:scale-110 transition-transform">
                      <i className="fas fa-mountain-sun"></i>
                    </div>
                    <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">ADVENTURE</span>
                  </div>
                  <h5 className="text-2xl font-black mb-2">NEON QUEST: ODYSSEY</h5>
                  <p className="text-sm text-slate-500 mb-8 leading-relaxed">Explore a procedurally generated cyber-world with other users. Co-op mode available.</p>
                  <button className="w-full py-4 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-purple-500/20 transition-all">PLAY CO-OP</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controller Sync Bottom Bar (Persistent in Gaming) */}
      {view === 'gaming' && (
        <div className="h-20 bg-indigo-900/90 backdrop-blur-2xl border-t border-white/10 flex items-center justify-between px-10 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-6">
            <div className="flex gap-1">
              <span className="w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-pulse"></span>
              <span className="w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-pulse [animation-delay:0.2s]"></span>
              <span className="w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-pulse [animation-delay:0.4s]"></span>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-white">XBOX Elite Sync Active • Ready for Soccer World</p>
          </div>
          <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 transition-all">Hub Settings</button>
        </div>
      )}
    </div>
  );
};

export default ContentModule;
