
import React, { useState, useEffect, useRef } from 'react';
import { askRobot } from '../services/geminiService';

interface RobotAssistantProps {
  robotName: string;
  onCommand: (cmd: string) => void;
  onDistress: (msg: string) => void;
}

const RobotAssistant: React.FC<RobotAssistantProps> = ({ robotName, onCommand, onDistress }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastWords, setLastWords] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);

  const distressKeywords = ['help', 'stop', 'kill', 'gunshot', 'police', 'danger', 'don\'t kill me', 'help me'];

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        
        // Security logic: distress detection
        if (distressKeywords.some(keyword => transcript.includes(keyword))) {
          onDistress(`Distress Alert: High-priority acoustic trigger "${transcript}" recognized.`);
        }

        if (event.results[event.results.length - 1].isFinal) {
          setLastWords(transcript);
          onCommand(transcript);
          handleRobotQuery(transcript);
        }
      };
      
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.start();
    }

    const initMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new AudioContext();
        analyzerRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyzerRef.current);
        
        const monitor = () => {
          if (!analyzerRef.current) return;
          const data = new Uint8Array(analyzerRef.current.frequencyBinCount);
          analyzerRef.current.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b) / data.length;
          // Trigger high-decibel alert (shouts, screams, breaking glass)
          if (avg > 195) onDistress("Critical acoustic spike detected (Possible Violence/Impact).");
          requestAnimationFrame(monitor);
        };
        monitor();
      } catch (e) { console.warn("Acoustic node inactive."); }
    };
    initMic();

    return () => recognitionRef.current?.stop();
  }, []);

  const handleRobotQuery = async (query: string) => {
    setShowBubble(true);
    const response = await askRobot(query);
    setLastWords(response);
    speak(response);
  };

  const speak = (text: string) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => {
      setIsSpeaking(false);
      setTimeout(() => setShowBubble(false), 8000);
    };
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
      {showBubble && (
        <div className="max-w-[240px] bg-slate-900/90 backdrop-blur-2xl text-white p-5 rounded-[32px] rounded-br-none shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 text-[11px] font-bold leading-relaxed animate-in fade-in slide-in-from-bottom-4 pointer-events-auto">
          <div className="flex items-center gap-2 mb-2">
             <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{robotName}</p>
          </div>
          <p className="line-clamp-6 text-slate-100">{lastWords}</p>
        </div>
      )}
      
      <button 
        onClick={() => { if(!isListening) recognitionRef.current?.start(); }}
        className={`w-18 h-18 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.4)] transition-all transform pointer-events-auto relative active:scale-90 overflow-hidden
          ${isListening ? 'bg-slate-950 border-4 border-blue-600/50 shadow-[0_0_30px_rgba(37,99,235,0.3)]' : 'bg-gradient-to-br from-red-600 to-red-700 border-4 border-red-500/50'}
          ${isSpeaking ? 'scale-110' : 'scale-100'}
        `}
      >
        {/* Core Visual */}
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className={`absolute inset-0 rounded-full blur-xl ${isSpeaking ? 'bg-blue-400 animate-pulse' : isListening ? 'bg-blue-600' : 'bg-white opacity-20'}`}></div>
          <div className={`w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white] z-10 ${isSpeaking ? 'animate-bounce' : ''}`}></div>
        </div>
        
        {/* Interaction Waves */}
        {isListening && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             {[1, 2, 3].map(i => (
               <div 
                 key={i} 
                 className={`absolute inset-0 border-2 border-blue-500 rounded-full opacity-20 animate-ping`} 
                 style={{ animationDelay: `${i * 0.4}s` }}
                ></div>
             ))}
          </div>
        )}

        {isSpeaking && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center items-center gap-1">
             {[...Array(6)].map((_, i) => (
               <div 
                 key={i} 
                 className="w-1 bg-blue-400 rounded-full animate-[bounce_0.6s_infinite]" 
                 style={{ height: `${8 + Math.random() * 20}px`, animationDelay: `${i * 0.1}s` }}
                ></div>
             ))}
          </div>
        )}

        {/* Status Text Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
           <span className="text-[6px] font-black uppercase tracking-[0.4em] text-white/20 whitespace-nowrap">
             {isSpeaking ? 'BROADCASTING' : isListening ? 'LISTENING' : 'IDLE'}
           </span>
        </div>
      </button>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.8); }
        }
      `}</style>
    </div>
  );
};

export default RobotAssistant;
