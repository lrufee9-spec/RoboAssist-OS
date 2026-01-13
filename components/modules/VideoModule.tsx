
import React, { useState, useEffect, useRef } from 'react';

interface VideoItem {
  id: string;
  title: string;
  category: 'Movie' | 'Music' | 'Talent' | 'Information';
  price?: number;
  isPurchased: boolean;
  thumbnail: string;
  author: string;
  likes: number;
  comments: string[];
}

interface VideoModuleProps {
  onBack: () => void;
}

const VideoModule: React.FC<VideoModuleProps> = ({ onBack }) => {
  const [showAd, setShowAd] = useState(false);
  const [adTimer, setAdTimer] = useState(60); // 1 minute ad
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'BROWSE' | 'PLAYLIST' | 'MY_UPLOADS'>('BROWSE');
  
  // Mock data for videos
  const [videos, setVideos] = useState<VideoItem[]>([
    { id: 'v1', title: 'The Neural Frontier', category: 'Movie', isPurchased: false, thumbnail: 'https://picsum.photos/seed/frontier/400/225', author: 'RoboStudios', likes: 1200, comments: [] },
    { id: 'v2', title: 'Silicon Beats Vol 4', category: 'Music', isPurchased: false, thumbnail: 'https://picsum.photos/seed/beats/400/225', author: 'DJ Synth', likes: 4500, comments: [] },
    { id: 'v3', title: 'How to Build a Bot', category: 'Information', price: 19.99, isPurchased: false, thumbnail: 'https://picsum.photos/seed/build/400/225', author: 'Prof. Hardware', likes: 800, comments: [] },
    { id: 'v4', title: 'Extreme Robot Parkour', category: 'Talent', isPurchased: false, thumbnail: 'https://picsum.photos/seed/parkour/400/225', author: 'BoltRunner', likes: 9000, comments: [] },
    { id: 'v5', title: 'Deep Learning Mastery', category: 'Information', price: 29.99, isPurchased: false, thumbnail: 'https://picsum.photos/seed/learning/400/225', author: 'AI Academy', likes: 300, comments: [] },
  ]);

  // Periodic Ad Logic: Every 5 minutes (300,000 ms)
  useEffect(() => {
    const adTriggerInterval = setInterval(() => {
      setShowAd(true);
      setAdTimer(60);
    }, 300000); // 5 minutes

    return () => clearInterval(adTriggerInterval);
  }, []);

  // Ad Countdown Logic
  useEffect(() => {
    let interval: number;
    if (showAd && adTimer > 0) {
      interval = window.setInterval(() => {
        setAdTimer(prev => prev - 1);
      }, 1000);
    } else if (adTimer === 0) {
      setShowAd(false);
    }
    return () => clearInterval(interval);
  }, [showAd, adTimer]);

  const handlePurchase = (id: string) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, isPurchased: true } : v));
    alert("Subscription purchased! Video added to your playlist.");
  };

  const handleLike = (id: string) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, likes: v.likes + 1 } : v));
  };

  const handleDownload = (title: string) => {
    alert(`Initializing secure download: ${title}. File will be stored in your local storage hub.`);
  };

  const handleUpload = () => {
    const title = prompt("Enter Video Title:");
    if (!title) return;
    const category = prompt("Enter Category (Movie/Music/Talent/Information):") as any;
    const price = category === 'Information' ? parseFloat(prompt("Enter Price ($):") || "0") : undefined;

    const newVid: VideoItem = {
      id: `u${Date.now()}`,
      title,
      category: category || 'Information',
      price,
      isPurchased: true,
      thumbnail: `https://picsum.photos/seed/${title}/400/225`,
      author: 'You',
      likes: 0,
      comments: []
    };
    setVideos([newVid, ...videos]);
    alert("Video uploaded and syncing to global nodes!");
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const browseContent = filteredVideos.filter(v => activeTab === 'BROWSE' ? true : (activeTab === 'PLAYLIST' ? v.isPurchased : v.author === 'You'));

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col font-sans text-white overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 bg-slate-900/90 border-b border-white/5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-full border border-white/10 transition-all">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="hidden md:block">
            <h2 className="text-xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">Visionary Video</h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Global Broadcast Node</p>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8 relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          <input 
            type="text" 
            placeholder="Search movies, music, talent..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border-none rounded-2xl py-2.5 pl-11 pr-4 text-xs focus:ring-2 focus:ring-orange-500 transition-all shadow-inner"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={handleUpload} className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-600/20 transition-all">
            <i className="fas fa-cloud-arrow-up"></i>
          </button>
          <button className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center">
            <i className="fas fa-gear"></i>
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-20 md:w-64 bg-slate-950 border-r border-white/5 flex flex-col p-4 gap-2">
          <button 
            onClick={() => setActiveTab('BROWSE')}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] ${activeTab === 'BROWSE' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <i className="fas fa-compass text-lg"></i> <span className="hidden md:block">Browse All</span>
          </button>
          <button 
            onClick={() => setActiveTab('PLAYLIST')}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] ${activeTab === 'PLAYLIST' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <i className="fas fa-list-ul text-lg"></i> <span className="hidden md:block">Purchased Playlist</span>
          </button>
          <button 
            onClick={() => setActiveTab('MY_UPLOADS')}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] ${activeTab === 'MY_UPLOADS' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5'}`}
          >
            <i className="fas fa-video text-lg"></i> <span className="hidden md:block">My Information</span>
          </button>

          <div className="mt-auto p-4 bg-slate-900/50 rounded-3xl border border-white/5 hidden md:block">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-black text-slate-500 uppercase">Subscribed Nodes</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            <div className="space-y-3">
              {['Prof. Hardware', 'DJ Synth', 'AI Academy'].map(node => (
                <div key={node} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-[10px]"><i className="fas fa-user-check text-blue-400"></i></div>
                  <span className="text-[10px] font-bold text-slate-300">{node}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {activeTab === 'BROWSE' && (
            <div className="mb-12">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <i className="fas fa-bolt text-orange-500"></i> Trending Hub
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {browseContent.map(vid => (
                  <div key={vid.id} className="group flex flex-col space-y-3">
                    <div className="aspect-video bg-slate-900 rounded-[30px] overflow-hidden relative border border-white/5 shadow-2xl">
                      <img src={vid.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      {vid.price && !vid.isPurchased && (
                        <div className="absolute top-4 right-4 bg-orange-600 px-3 py-1 rounded-full text-[10px] font-black shadow-xl">
                          ${vid.price}
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex gap-2">
                          <button onClick={() => handleLike(vid.id)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-orange-500 transition-all">
                            <i className="fas fa-heart text-xs"></i>
                          </button>
                          <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-blue-500 transition-all">
                            <i className="fas fa-comment text-xs"></i>
                          </button>
                        </div>
                        {vid.isPurchased ? (
                          <button onClick={() => handleDownload(vid.title)} className="px-4 py-2 bg-green-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg">
                            <i className="fas fa-download"></i> Download
                          </button>
                        ) : (
                          vid.category === 'Information' ? (
                            <button onClick={() => handlePurchase(vid.id)} className="px-4 py-2 bg-orange-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg">
                              <i className="fas fa-cart-shopping"></i> Buy
                            </button>
                          ) : (
                            <button className="px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg">
                              <i className="fas fa-play"></i> Play
                            </button>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-sm truncate group-hover:text-orange-400 transition-colors">{vid.title}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{vid.author} • {vid.category}</span>
                        <span className="text-[10px] text-orange-500 font-black">{vid.likes.toLocaleString()} likes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'PLAYLIST' && (
            <div className="space-y-6">
              <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                <i className="fas fa-folder-open text-blue-500"></i> Purchased Content
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.filter(v => v.isPurchased).map(vid => (
                   <div key={vid.id} className="flex gap-4 p-4 bg-slate-900 rounded-3xl border border-white/5 hover:bg-slate-800 transition-all cursor-pointer group">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden relative flex-shrink-0">
                        <img src={vid.thumbnail} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <i className="fas fa-play text-white text-xs"></i>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-sm font-black mb-1">{vid.title}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-3">{vid.author}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleDownload(vid.title)} className="text-[9px] font-black text-blue-400 hover:text-blue-300 uppercase">Download</button>
                          <span className="text-slate-700">|</span>
                          <button className="text-[9px] font-black text-slate-500 hover:text-white uppercase">Share Link</button>
                        </div>
                      </div>
                   </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'MY_UPLOADS' && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-32 h-32 bg-slate-900 rounded-[40px] flex items-center justify-center border border-white/5 shadow-2xl">
                 <i className="fas fa-film text-6xl text-slate-800"></i>
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-black">Information Video Repository</h3>
                 <p className="text-sm text-slate-500 max-w-sm mx-auto">Upload your talented videos or information content. Set a price and let other RoboNodes subscribe to your knowledge.</p>
               </div>
               <button onClick={handleUpload} className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-600/20 transition-all active:scale-95">
                 <i className="fas fa-plus mr-3"></i> Initialized New Broadcast
               </button>
            </div>
          )}
        </div>
      </div>

      {/* 1 Min Pop-out Ad Mockup */}
      {showAd && (
        <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-500">
          <div className="w-full max-w-4xl aspect-video bg-slate-900 rounded-[50px] overflow-hidden relative shadow-[0_0_100px_rgba(249,115,22,0.2)] border-4 border-orange-500/30">
            <div className="absolute top-8 left-8 z-10">
              <span className="px-4 py-1.5 bg-orange-600/20 backdrop-blur-xl border border-orange-500/50 rounded-full text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
                ROBONODE SPONSORED CONTENT • {adTimer}s REMAINING
              </span>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 space-y-8">
              <div className="relative">
                <i className="fas fa-robot text-8xl text-orange-500 animate-bounce"></i>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 font-black text-xs shadow-2xl">NEW</div>
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">UPGRADE TO<br/><span className="text-orange-500">TITANIUM CORE V5</span></h2>
                <p className="text-slate-400 max-w-lg mx-auto text-lg leading-relaxed font-medium">Experience zero-latency neural processing and 500% more battery efficiency. Trusted by AlphaBots worldwide.</p>
              </div>
              <div className="flex gap-4">
                <button className="px-12 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-500 shadow-2xl shadow-orange-600/40 transition-all scale-110">ORDER MODULE NOW</button>
                <button onClick={() => setShowAd(false)} className="px-8 py-4 bg-slate-800 text-slate-500 font-black rounded-2xl border border-white/5 opacity-50 cursor-not-allowed">Skip in {adTimer}s</button>
              </div>
            </div>

            {/* Ad Progress Bar */}
            <div className="absolute bottom-0 left-0 h-2 bg-orange-600 w-full">
              <div 
                className="h-full bg-white shadow-[0_0_20px_white] transition-all duration-1000 ease-linear" 
                style={{ width: `${(adTimer / 60) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Player Context (Mini Bar) */}
      <div className="h-20 bg-slate-900/95 backdrop-blur-2xl border-t border-white/5 flex items-center justify-between px-8 z-30">
        <div className="flex items-center gap-4 w-1/3">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex-shrink-0"></div>
          <div className="hidden sm:block">
             <p className="text-xs font-black uppercase truncate">Not Playing</p>
             <p className="text-[9px] text-slate-500 font-bold">Select content to initialize broadcast</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-slate-500 hover:text-white transition-colors"><i className="fas fa-backward-step"></i></button>
          <button className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center text-xl shadow-lg shadow-orange-600/20 hover:scale-110 active:scale-95 transition-all"><i className="fas fa-play"></i></button>
          <button className="text-slate-500 hover:text-white transition-colors"><i className="fas fa-forward-step"></i></button>
        </div>

        <div className="flex items-center gap-4 w-1/3 justify-end">
          <div className="hidden lg:flex items-center gap-2">
            <i className="fas fa-volume-high text-xs text-slate-500"></i>
            <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-orange-500"></div>
            </div>
          </div>
          <button className="text-orange-500 hover:text-orange-400"><i className="fas fa-expand"></i></button>
        </div>
      </div>
    </div>
  );
};

export default VideoModule;
