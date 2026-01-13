
import React, { useState, useRef, useEffect } from 'react';

interface TerminalModuleProps {
  onBack: () => void;
}

const TerminalModule: React.FC<TerminalModuleProps> = ({ onBack }) => {
  const [history, setHistory] = useState<string[]>(['Welcome to RoboOS Bash v5.2.0', 'Type "help" for a list of commands.']);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `robot@user:~$ ${input}`];

    switch (cmd) {
      case 'help':
        newHistory.push('Available: help, clear, status, files, ai --ask [query], whoami');
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'status':
        newHistory.push('CPU: 12% | RAM: 4.2GB/16GB | Robot Sensors: ONLINE');
        break;
      case 'files':
        newHistory.push('drwxr-xr-x  docs\ndrwxr-xr-x  photos\n-rw-r--r--  manifest.json');
        break;
      case 'whoami':
        newHistory.push('Personal Assistant Admin');
        break;
      default:
        if (cmd.startsWith('ai --ask')) {
          newHistory.push('AI: Thinking... Command executed via Neural Bridge.');
        } else {
          newHistory.push(`-bash: ${cmd}: command not found`);
        }
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="w-full h-full bg-black flex flex-col font-mono text-green-500 text-sm">
      <div className="p-3 bg-slate-900 flex justify-between items-center text-slate-400">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs">RoboOS Linux Terminal</div>
        <button onClick={onBack} className="hover:text-white transition-colors"><i className="fas fa-times"></i></button>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
        <form onSubmit={handleCommand} className="flex gap-2">
          <span className="text-blue-400">robot@user:~$</span>
          <input 
            autoFocus
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-green-500 p-0"
          />
        </form>
      </div>
    </div>
  );
};

export default TerminalModule;
