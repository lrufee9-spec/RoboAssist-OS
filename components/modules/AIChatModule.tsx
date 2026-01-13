
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { askRobot } from '../../services/geminiService';

interface AIChatModuleProps {
  onBack: () => void;
}

const AIChatModule: React.FC<AIChatModuleProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const nearbyUsers = [
    { id: 'u1', name: 'Office Node 04', distance: '12m', status: 'Sync Ready' },
    { id: 'u2', name: 'Road Assist 09', distance: '150m', status: 'Translating' },
  ];

  const reminders = [
    { id: 'r1', title: 'Strategy Meeting', time: '14:30' },
    { id: 'r2', title: 'Neural Maintenance', time: '18:00' },
  ];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      recognitionRef.current.onerror = () => setIsRecording(false);
    }
  }, []);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 0.9; // More robotic
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    const aiResponse = await askRobot(currentInput, "This is the AI Chat module. User can ask to search files, translate, or set reminders.");
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: aiResponse || "I am analyzing your request...",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
    speak(aiResponse || "Processing complete.");
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const handleFileUpload = () => {
    const dummyMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: "Sent a document: 'annual_report_v2.pdf'",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, dummyMsg]);
  };

  return (
    <div className="w-full h-full bg-slate-900 flex overflow-hidden">
      {/* Side Actions Drawer */}
      <div className={`w-64 bg-slate-950 border-r border-white/5 p-4 flex flex-col transition-all duration-300 ${showDiscovery || showReminders ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fas fa-microchip text-white"></i>
          </div>
          <h2 className="font-black text-sm tracking-widest uppercase text-white">Neural Hub</h2>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto">
          {/* Discovery / Translator */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nearby AI Nodes</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            </div>
            {nearbyUsers.map(u => (
              <button key={u.id} className="w-full text-left p-3 rounded-2xl bg-slate-900 border border-white/5 hover:border-blue-500/50 transition-all group">
                <p className="text-xs font-bold text-white mb-0.5">{u.name}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-slate-500">{u.distance} away</span>
                  <span className="text-[9px] text-green-500 font-bold group-hover:underline">{u.status}</span>
                </div>
              </button>
            ))}
            <button className="w-full py-2 text-[10px] font-black text-blue-500 uppercase tracking-tighter hover:underline">Launch Translator</button>
          </div>

          {/* Reminders */}
          <div className="space-y-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Scheduled Tasks</span>
            {reminders.map(r => (
              <div key={r.id} className="p-3 rounded-2xl bg-slate-900/50 border border-white/5 flex items-center gap-3">
                <i className="fas fa-clock text-blue-400 text-xs"></i>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-200">{r.title}</p>
                  <p className="text-[9px] text-slate-500">{r.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto p-2">
          <div className="bg-slate-900 rounded-2xl p-4 border border-white/5">
            <p className="text-[9px] text-slate-500 font-bold uppercase mb-2">Voice Accuracy</p>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="w-[98%] h-full bg-blue-500"></div>
            </div>
            <p className="text-[9px] text-right mt-1 text-blue-500 font-black">99.8%</p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900">
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-full border border-white/5"><i className="fas fa-arrow-left"></i></button>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fas fa-robot text-white"></i>
            </div>
            <div>
              <h2 className="font-black text-white text-sm">Neural Assist Core</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Sync Active</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white" title="Search Everything"><i className="fas fa-search"></i></button>
            <button className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white" title="Translate Context"><i className="fas fa-language"></i></button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto opacity-30">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-brain text-4xl"></i>
              </div>
              <h3 className="text-xl font-black mb-2">NEURAL CORE READY</h3>
              <p className="text-sm">Ask me to search your mobile, set reminders, translate nearby speech, or share documents with other nodes.</p>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[75%] p-4 rounded-3xl ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'}`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <div className="flex items-center justify-between mt-2 opacity-50">
                  <span className="text-[9px] font-bold uppercase">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {msg.sender === 'ai' && <i className="fas fa-volume-up text-[10px]"></i>}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 p-4 rounded-3xl rounded-tl-none border border-white/5">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/5">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-3">
            <div className="flex-1 bg-slate-900 rounded-[28px] border border-white/10 p-2 flex items-end gap-2 shadow-inner">
              <button 
                type="button" 
                onClick={handleFileUpload}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-800 hover:text-white transition-all"
              >
                <i className="fas fa-plus"></i>
              </button>
              <textarea 
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask Neural Assist..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white py-2 resize-none"
              />
              <button 
                type="button" 
                onClick={toggleRecording}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:bg-slate-800 hover:text-blue-500'}`}
              >
                <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
              </button>
            </div>
            <button 
              type="submit" 
              className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-[22px] flex items-center justify-center shadow-xl shadow-blue-600/20 transition-all active:scale-90"
            >
              <i className="fas fa-paper-plane text-xl"></i>
            </button>
          </form>
          <div className="flex justify-center gap-6 mt-3">
            <button className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-400 flex items-center gap-1"><i className="fas fa-bell"></i> Set Reminder</button>
            <button className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-400 flex items-center gap-1"><i className="fas fa-folder-open"></i> Search Files</button>
            <button className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-blue-400 flex items-center gap-1"><i className="fas fa-globe"></i> Global Query</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatModule;
