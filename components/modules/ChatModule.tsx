
import React, { useState, useRef, useEffect } from 'react';

interface ChatModuleProps {
  onBack: () => void;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  lastMsg: string;
  status: 'online' | 'offline';
  avatar: string;
  isBlocked?: boolean;
}

const ChatModule: React.FC<ChatModuleProps> = ({ onBack }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [showCallUI, setShowCallUI] = useState<'audio' | 'video' | null>(null);
  const [translatorLang, setTranslatorLang] = useState('Japanese');
  const [isTranslatorActive, setIsTranslatorActive] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'John Doe', phone: '+1 234 567 8901', lastMsg: 'Hey, did you see the bot update?', status: 'online', avatar: 'https://picsum.photos/seed/1/100' },
    { id: '2', name: 'Alice Smith', phone: '+44 7700 900077', lastMsg: 'Sent you a voice note.', status: 'offline', avatar: 'https://picsum.photos/seed/2/100' },
    { id: '3', name: 'Sarah Tech', phone: '+49 151 1234567', lastMsg: 'Call me when free.', status: 'online', avatar: 'https://picsum.photos/seed/3/100' },
  ]);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordTime((prev) => {
          if (prev >= 120) { // 2 minute limit
            stopRecording();
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordTime(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);

  const handleSendMessage = () => {
    if (message.length > 50) {
      alert("Message exceeds 50 characters. Syncing to INBOX for Storyline/Email creation...");
      // Logic would redirect or flag for inbox sync
    }
    setMessage('');
  };

  const addFriend = () => {
    const phone = prompt("Enter friend's telephone number:");
    if (phone) {
      const newFriend: Contact = {
        id: Date.now().toString(),
        name: `User ${phone.slice(-4)}`,
        phone,
        lastMsg: 'New Friend Added',
        status: 'online',
        avatar: `https://picsum.photos/seed/${phone}/100`
      };
      setContacts([...contacts, newFriend]);
    }
  };

  const toggleBlock = (id: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, isBlocked: !c.isBlocked } : c));
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full bg-slate-900 flex overflow-hidden font-sans">
      {/* Sidebar: Contact List */}
      <div className={`w-full md:w-80 flex flex-col border-r border-white/5 bg-slate-950 transition-all ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 bg-slate-900/50 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <i className="fas fa-arrow-left text-blue-400"></i>
            </button>
            <h2 className="text-lg font-black tracking-tight text-white uppercase">Neural Chat</h2>
          </div>
          <button onClick={addFriend} className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
            <i className="fas fa-user-plus"></i>
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
            <input 
              placeholder="Search friends or numbers..." 
              className="w-full bg-slate-900 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:ring-1 focus:ring-blue-500" 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 px-2">
          {contacts.map(c => (
            <div key={c.id} className="relative group">
              <button 
                onClick={() => setSelectedContact(c)}
                disabled={c.isBlocked}
                className={`w-full p-4 flex items-center gap-4 rounded-2xl transition-all ${selectedContact?.id === c.id ? 'bg-blue-600/20 border-blue-500/50' : 'hover:bg-slate-900'} ${c.isBlocked ? 'opacity-40 grayscale' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <img src={c.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-lg" alt={c.name} />
                  {c.status === 'online' && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-slate-950 rounded-full"></div>}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <h4 className="font-black text-white text-sm truncate">{c.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{c.isBlocked ? 'Blocked Contact' : c.lastMsg}</p>
                </div>
              </button>
              <button 
                onClick={() => toggleBlock(c.id)}
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500 transition-all"
                title={c.isBlocked ? "Unblock" : "Block"}
              >
                <i className={`fas ${c.isBlocked ? 'fa-user-check' : 'fa-user-slash'} text-xs`}></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-slate-950/30 relative ${!selectedContact ? 'hidden md:flex items-center justify-center text-slate-600' : 'flex'}`}>
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="p-4 bg-slate-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedContact(null)} className="md:hidden p-2 text-slate-400"><i className="fas fa-arrow-left"></i></button>
                <div className="relative">
                  <img src={selectedContact.avatar} className="w-10 h-10 rounded-xl" alt="" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-black text-white text-sm">{selectedContact.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-green-500 font-black uppercase tracking-widest">Active Link</span>
                    <span className="text-[9px] text-slate-500">•</span>
                    <span className="text-[9px] text-blue-500 font-bold">{selectedContact.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowCallUI('audio')}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 transition-all flex items-center justify-center text-white"
                >
                  <i className="fas fa-phone"></i>
                </button>
                <button 
                  onClick={() => setShowCallUI('video')}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 transition-all flex items-center justify-center text-white"
                >
                  <i className="fas fa-video"></i>
                </button>
                <div className="w-[1px] h-10 bg-white/5 mx-2"></div>
                <button className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all flex items-center justify-center text-slate-400">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="flex justify-center py-4">
                <span className="px-4 py-1 bg-white/5 rounded-full text-[9px] font-bold text-slate-500 uppercase tracking-widest">End-to-end Encrypted Protocol</span>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-slate-800 p-4 rounded-3xl rounded-tl-none border border-white/5 max-w-[70%]">
                  <p className="text-sm text-slate-200">System detected high latency in your area. Robo-Translator 5.0 initialized for next call.</p>
                  <span className="text-[9px] text-slate-500 font-bold block mt-2 uppercase tracking-tighter">12:30 PM • RoboAssist</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-600 p-4 rounded-3xl rounded-tr-none shadow-xl max-w-[70%]">
                  <p className="text-sm text-white">Okay, I will share my current GPS coordinates now.</p>
                  <div className="mt-3 p-2 bg-black/20 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><i className="fas fa-location-dot"></i></div>
                    <span className="text-[10px] font-bold">Location Shared (Sync Active)</span>
                  </div>
                  <span className="text-[9px] text-blue-200 font-bold block mt-2 uppercase tracking-tighter text-right">Sent • 12:45 PM</span>
                </div>
              </div>
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/5">
              {/* Media/Tool Bar */}
              <div className="flex gap-4 mb-3 px-2">
                <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-widest">
                  <i className="fas fa-location-arrow text-xs"></i> GPS
                </button>
                <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-purple-400 transition-colors uppercase tracking-widest">
                  <i className="fas fa-film text-xs"></i> Video
                </button>
                <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-orange-400 transition-colors uppercase tracking-widest">
                  <i className="fas fa-file-invoice text-xs"></i> Document
                </button>
                <button className="ml-auto text-slate-500 hover:text-pink-500 transition-colors">
                  <i className="fas fa-face-smile"></i>
                </button>
              </div>

              <div className="flex items-end gap-3">
                <div className={`flex-1 bg-slate-900 border ${message.length > 50 ? 'border-orange-500' : 'border-white/5'} rounded-2xl p-2 flex items-end gap-2 shadow-inner transition-colors`}>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white py-2 resize-none max-h-32"
                    rows={1}
                  />
                  
                  {/* Character Counter */}
                  <div className={`flex flex-col items-end pr-2 py-2 gap-1`}>
                    <span className={`text-[9px] font-black ${message.length > 50 ? 'text-orange-500' : 'text-slate-600'}`}>
                      {message.length}/50
                    </span>
                    {message.length > 50 && (
                      <span className="text-[7px] font-black uppercase tracking-tighter text-orange-400 animate-pulse">Syncing to Inbox</span>
                    )}
                  </div>

                  <button 
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={stopRecording}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white scale-110' : 'text-slate-500 hover:bg-slate-800'}`}
                  >
                    <i className="fas fa-microphone"></i>
                  </button>
                </div>
                
                <button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="w-14 h-14 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20 transition-all"
                >
                  <i className="fas fa-paper-plane text-xl"></i>
                </button>
              </div>

              {/* Voice Recording Overlay/Indicator */}
              {isRecording && (
                <div className="absolute inset-0 bg-red-600/90 backdrop-blur-sm z-20 flex items-center justify-center rounded-t-3xl border-t border-red-400">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                      <i className="fas fa-microphone text-3xl text-white"></i>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white">RECORDING AUDIO</h4>
                      <p className="text-xs font-bold text-red-100 uppercase tracking-widest">{formatTime(recordTime)} / 2:00 Limit</p>
                    </div>
                    <div className="flex justify-center gap-1">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-1 bg-white rounded-full animate-[bounce_0.5s_infinite]" style={{ height: `${10 + Math.random() * 30}px`, animationDelay: `${i * 0.05}s` }}></div>
                      ))}
                    </div>
                    <p className="text-[10px] text-white/50 uppercase font-black">Release button to send to friend</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center p-12 space-y-6">
            <div className="w-32 h-32 bg-slate-900 rounded-[40px] flex items-center justify-center mx-auto border border-white/5 shadow-2xl">
              <i className="fas fa-comments text-6xl text-slate-800"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-200">Neural Sync Waiting</h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">Select a contact to initialize end-to-end encrypted communication or add a new friend via phone number.</p>
            </div>
            <button onClick={addFriend} className="px-8 py-3 bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform">Add Friend Node</button>
          </div>
        )}

        {/* Call UI Modal */}
        {showCallUI && (
          <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-full max-w-lg flex flex-col items-center gap-8">
              <div className="relative">
                <img src={selectedContact?.avatar} className={`w-32 h-32 rounded-[40px] border-4 border-blue-500 shadow-2xl ${showCallUI === 'video' ? 'hidden' : 'block'}`} alt="" />
                {showCallUI === 'video' && (
                  <div className="w-80 h-120 bg-slate-900 rounded-[40px] border-4 border-indigo-600 overflow-hidden relative shadow-2xl">
                    <img src={selectedContact?.avatar} className="w-full h-full object-cover grayscale opacity-50" alt="" />
                    <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                      <div className="w-full h-full border-[10px] border-white/5 animate-pulse"></div>
                    </div>
                    <div className="absolute top-4 right-4 w-24 h-32 bg-slate-800 rounded-2xl border-2 border-white/10 shadow-lg overflow-hidden">
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-500">YOU</div>
                    </div>
                  </div>
                )}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                  Connecting...
                </div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-3xl font-black text-white">{selectedContact?.name}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Calling {selectedContact?.phone}</p>
              </div>

              {/* Instant Translator Control */}
              <div className="w-full bg-slate-900/50 p-6 rounded-[32px] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-colors ${isTranslatorActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-600'}`}>
                      <i className="fas fa-language"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-white">Instant Translator</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Real-time Call Sync</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsTranslatorActive(!isTranslatorActive)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${isTranslatorActive ? 'bg-blue-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isTranslatorActive ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
                
                {isTranslatorActive && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Target Country:</span>
                    <select 
                      value={translatorLang}
                      onChange={(e) => setTranslatorLang(e.target.value)}
                      className="flex-1 bg-slate-800 border-none rounded-xl text-xs font-bold text-blue-400 py-2 px-3 focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Japanese</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                      <option>Chinese</option>
                      <option>Arabic</option>
                      <option>Russian</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-8">
                <button className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-white text-xl hover:bg-slate-700 transition-all">
                  <i className="fas fa-microphone-slash"></i>
                </button>
                <button 
                  onClick={() => setShowCallUI(null)}
                  className="w-20 h-20 rounded-[30px] bg-red-600 flex items-center justify-center text-white text-3xl shadow-2xl shadow-red-600/30 hover:scale-110 active:scale-95 transition-all"
                >
                  <i className="fas fa-phone-slash"></i>
                </button>
                <button className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-white text-xl hover:bg-slate-700 transition-all">
                  <i className="fas fa-volume-high"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModule;
