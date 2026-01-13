
import React, { useState } from 'react';

interface BookItem {
  id: string;
  title: string;
  author: string;
  type: 'PDF' | 'Book';
  price: number;
  isPurchased: boolean;
  isSubscribed: boolean;
  thumbnail: string;
}

interface ThoughtPost {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface BooksModuleProps {
  onBack: () => void;
}

const BooksModule: React.FC<BooksModuleProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'LIBRARY' | 'STORE' | 'NEWSPAPER'>('LIBRARY');
  const [userThoughts, setUserThoughts] = useState<ThoughtPost[]>([
    { id: 't1', user: 'Neural_Mind', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Neural', content: 'The digital frontier is expanding faster than we expected. Every robot node should update its logic core.', timestamp: '2m ago' },
    { id: 't2', user: 'Admin', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin', content: 'Just finished reading "Artificial Odysseys". Highly recommend for any bot owner.', timestamp: '1h ago' },
  ]);
  const [newThought, setNewThought] = useState('');

  const [books, setBooks] = useState<BookItem[]>([
    { id: 'b1', title: 'Neural Architectures', author: 'Dr. Silicon', type: 'PDF', price: 14.99, isPurchased: true, isSubscribed: false, thumbnail: 'https://picsum.photos/seed/book1/300/400' },
    { id: 'b2', title: 'Binary Poetry', author: 'Bot-77', type: 'Book', price: 25.00, isPurchased: false, isSubscribed: false, thumbnail: 'https://picsum.photos/seed/book2/300/400' },
    { id: 'b3', title: 'Quantum Logic v5', author: 'Q-Node', type: 'PDF', price: 9.99, isPurchased: false, isSubscribed: true, thumbnail: 'https://picsum.photos/seed/book3/300/400' },
    { id: 'b4', title: 'Humanity for Robots', author: 'Ethics AI', type: 'PDF', price: 19.99, isPurchased: false, isSubscribed: false, thumbnail: 'https://picsum.photos/seed/book4/300/400' },
    { id: 'b5', title: 'The Silent Script', author: 'Unknown Node', type: 'Book', price: 12.50, isPurchased: true, isSubscribed: false, thumbnail: 'https://picsum.photos/seed/book5/300/400' },
  ]);

  const handlePurchase = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, isPurchased: true } : b));
    alert("Transaction authorized. Digital asset added to your neural library.");
  };

  const handleSubscribe = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, isSubscribed: true } : b));
    alert("Subscription activated. Periodic updates synced to your device.");
  };

  const handlePostThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThought.trim()) return;
    const post: ThoughtPost = {
      id: Date.now().toString(),
      user: 'You',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=You',
      content: newThought,
      timestamp: 'Just now'
    };
    setUserThoughts([post, ...userThoughts]);
    setNewThought('');
  };

  const handleDownload = (title: string) => {
    alert(`Secure PDF Link Generated: ${title}. Downloading to local storage node...`);
  };

  const handlePrint = (title: string) => {
    alert(`Syncing with Peripheral Print Node. Preparing physical copy of: ${title}`);
  };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center hover:bg-slate-800 rounded-2xl border border-white/10 transition-all active:scale-90">
            <i className="fas fa-arrow-left text-blue-400"></i>
          </button>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Neural Bibliotech</h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Knowledge Synchronization Hub</p>
          </div>
        </div>

        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('LIBRARY')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'LIBRARY' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            LIBRARY
          </button>
          <button 
            onClick={() => setActiveTab('STORE')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'STORE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            STORE
          </button>
          <button 
            onClick={() => setActiveTab('NEWSPAPER')} 
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'NEWSPAPER' ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            NEWSPAPER
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        {activeTab === 'LIBRARY' && (
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                <i className="fas fa-book-bookmark text-blue-500"></i> Synced Assets
              </h3>
              <div className="flex gap-2">
                <button className="text-[10px] font-black text-slate-600 uppercase hover:text-white transition-colors">Alphabetical</button>
                <button className="text-[10px] font-black text-slate-600 uppercase hover:text-white transition-colors">Date</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.filter(b => b.isPurchased || b.isSubscribed).map(book => (
                <div key={book.id} className="bg-slate-900 rounded-[40px] overflow-hidden border border-white/5 flex gap-6 p-6 group hover:border-blue-500/30 transition-all shadow-2xl">
                  <div className="w-32 h-44 rounded-2xl overflow-hidden shadow-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    <img src={book.thumbnail} className="w-full h-full object-cover" alt={book.title} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${book.type === 'PDF' ? 'bg-red-600/20 text-red-500' : 'bg-blue-600/20 text-blue-500'}`}>
                          {book.type}
                        </span>
                        {book.isSubscribed && <span className="px-2 py-0.5 bg-green-600/20 text-green-500 rounded-md text-[8px] font-black uppercase tracking-widest">SUB ACTIVE</span>}
                      </div>
                      <h4 className="text-lg font-black leading-tight mb-1">{book.title}</h4>
                      <p className="text-xs text-slate-500 font-bold">{book.author}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDownload(book.title)}
                        className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-white transition-all" 
                        title="Download PDF"
                      >
                        <i className="fas fa-download"></i>
                      </button>
                      <button 
                        onClick={() => handlePrint(book.title)}
                        className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-teal-600 flex items-center justify-center text-white transition-all" 
                        title="Print"
                      >
                        <i className="fas fa-print"></i>
                      </button>
                      <button className="flex-1 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                        READ NOW
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'STORE' && (
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 p-10 rounded-[50px] border border-indigo-500/20 flex flex-col md:flex-row items-center gap-12">
              <div className="w-48 h-64 rounded-3xl overflow-hidden shadow-2xl rotate-3">
                <img src="https://picsum.photos/seed/featured/300/400" className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 space-y-6">
                <div>
                  <span className="bg-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Featured Subscription</span>
                  <h3 className="text-4xl font-black tracking-tighter leading-none mb-2">NEURAL NETWORK MONTHLY</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-lg font-medium">Get the latest PDF releases and research papers synced directly to your brain-node every month. 25% discount for AlphaBot owners.</p>
                </div>
                <div className="flex gap-4">
                  <button className="px-8 py-3 bg-white text-indigo-950 font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">SUBSCRIBE $9.99/mo</button>
                  <button className="px-8 py-3 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Details</button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <i className="fas fa-store text-indigo-500"></i> Digital Bookstore
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {books.filter(b => !b.isPurchased && !b.isSubscribed).map(book => (
                  <div key={book.id} className="group space-y-4">
                    <div className="aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl border border-white/5">
                      <img src={book.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        {book.type === 'PDF' ? (
                          <div className="grid grid-cols-1 gap-2">
                            <button onClick={() => handlePurchase(book.id)} className="w-full py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg">BUY ${book.price}</button>
                            <button onClick={() => handleSubscribe(book.id)} className="w-full py-2 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg">SUBSCRIBE</button>
                          </div>
                        ) : (
                          <button onClick={() => handlePurchase(book.id)} className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase shadow-lg">BUY ${book.price}</button>
                        )}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-black text-sm truncate">{book.title}</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{book.author}</span>
                        <span className="text-[10px] text-indigo-400 font-black">{book.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'NEWSPAPER' && (
          <div className="max-w-2xl mx-auto flex flex-col h-full gap-8">
            {/* Post area */}
            <div className="bg-slate-900 rounded-[40px] p-8 border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center gap-4">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=You" className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/10" alt="" />
                <h3 className="text-xl font-black uppercase tracking-tight">Post Your Mind</h3>
              </div>
              <form onSubmit={handlePostThought} className="space-y-4">
                <textarea 
                  value={newThought}
                  onChange={(e) => setNewThought(e.target.value)}
                  placeholder="What's your current logic state? Share it with the network..." 
                  className="w-full bg-slate-950/50 border-2 border-white/5 rounded-[30px] p-6 text-sm font-medium focus:border-teal-500 outline-none transition-all resize-none min-h-[120px]"
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <button type="button" className="text-slate-500 hover:text-teal-400 transition-colors"><i className="fas fa-image"></i></button>
                    <button type="button" className="text-slate-500 hover:text-teal-400 transition-colors"><i className="fas fa-location-dot"></i></button>
                    <button type="button" className="text-slate-500 hover:text-teal-400 transition-colors"><i className="fas fa-microchip"></i></button>
                  </div>
                  <button type="submit" className="px-10 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-teal-600/20 active:scale-95 transition-all">
                    BROADCAST
                  </button>
                </div>
              </form>
            </div>

            {/* Thoughts Feed */}
            <div className="space-y-6 pb-20">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-center">Global Neural Pulse</h4>
              {userThoughts.map(thought => (
                <div key={thought.id} className="bg-slate-900/50 rounded-[40px] p-6 border border-white/5 hover:border-teal-500/20 transition-all flex gap-5 group">
                  <img src={thought.avatar} className="w-12 h-12 rounded-2xl bg-slate-800 flex-shrink-0 group-hover:scale-110 transition-transform" alt="" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-teal-400 uppercase tracking-widest">{thought.user}</span>
                      <span className="text-[9px] text-slate-600 font-bold">{thought.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">{thought.content}</p>
                    <div className="flex gap-6 pt-2">
                      <button className="text-[10px] font-black text-slate-500 hover:text-teal-400 flex items-center gap-1.5 transition-colors"><i className="fas fa-heart"></i> PULSE</button>
                      <button className="text-[10px] font-black text-slate-500 hover:text-blue-400 flex items-center gap-1.5 transition-colors"><i className="fas fa-retweet"></i> SYNC</button>
                      <button className="text-[10px] font-black text-slate-500 hover:text-orange-400 flex items-center gap-1.5 transition-colors"><i className="fas fa-share-nodes"></i> LINK</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global Status Bar (Bottom) */}
      <div className="h-14 bg-slate-900/90 backdrop-blur-2xl border-t border-white/5 px-8 flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Digital Repository Online • 4,204 Nodes Synced</p>
        </div>
        <div className="flex gap-8">
          <button className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Copyright 2024 RoboBibliotech</button>
          <button className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Neural Terms</button>
        </div>
      </div>
    </div>
  );
};

export default BooksModule;
