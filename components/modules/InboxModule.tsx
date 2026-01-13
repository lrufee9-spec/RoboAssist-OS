
import React, { useState } from 'react';

interface Email {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  content: string;
  timestamp: string;
  read: boolean;
  hasAttachment?: boolean;
}

interface InboxModuleProps {
  onBack: () => void;
}

const InboxModule: React.FC<InboxModuleProps> = ({ onBack }) => {
  const [view, setView] = useState<'LIST' | 'READ' | 'COMPOSE'>('LIST');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      sender: 'Nova Security',
      subject: 'Security Protocol Updated',
      snippet: 'The AlphaBot in Zone-B has recognized your credentials...',
      content: 'Hello Admin,\n\nThis is an automated notification from Nova Security. Your neural credentials have been successfully synced with the AlphaBot network in Zone-B. All security protocols are now active and monitoring for potential threats.\n\nBest regards,\nNova AI',
      timestamp: '10:45 AM',
      read: false,
      hasAttachment: true
    },
    {
      id: '2',
      sender: 'Global Storage',
      subject: 'Storage Limit Warning',
      snippet: 'You have reached 85% of your cloud storage limit...',
      content: 'Dear User,\n\nYour current storage usage is at 85%. To ensure uninterrupted service for your DJ music and video files, consider upgrading your storage plan or cleaning up temporary neural cache.\n\nGlobal Storage Team',
      timestamp: 'Yesterday',
      read: true
    },
    {
      id: '3',
      sender: 'RoboFriends Network',
      subject: 'New Friend Request',
      snippet: 'Bot-X from the Tokyo node wants to sync with you...',
      content: 'A robot named Bot-X, owned by User Hiroshi, has requested a neural friendship. Syncing allows cross-border data translation and shared security monitoring.',
      timestamp: '2 days ago',
      read: true,
      hasAttachment: true
    }
  ]);

  const handleReadEmail = (email: Email) => {
    setSelectedEmail(email);
    setView('READ');
    setEmails(emails.map(e => e.id === email.id ? { ...e, read: true } : e));
  };

  const simulatePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      alert("Successfully synced with Local Print Machine. Document dispatched to tray.");
      setIsPrinting(false);
    }, 2000);
  };

  const simulatePDFConvert = () => {
    setIsConverting(true);
    setTimeout(() => {
      alert("Neural Engine: Email content converted to PDF and stored in Files/Documents.");
      setIsConverting(false);
    }, 1500);
  };

  const handleAttach = () => {
    const file = prompt("Enter filename to attach (e.g. report.doc):");
    if (file) setAttachmentName(file);
  };

  return (
    <div className="w-full h-full bg-slate-900 flex flex-col font-sans text-white">
      {/* Top Header */}
      <div className="p-4 bg-slate-950 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={view === 'LIST' ? onBack : () => setView('LIST')} className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-full transition-colors border border-white/10">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="flex flex-col">
            <h2 className="text-lg font-black uppercase tracking-tighter">Secure Mail Engine</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">End-to-End Encrypted Node</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {view === 'LIST' && (
            <button 
              onClick={() => setView('COMPOSE')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              <i className="fas fa-pen-fancy"></i> Compose
            </button>
          )}
          {view === 'READ' && (
            <>
              <button 
                onClick={simulatePDFConvert}
                disabled={isConverting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all border border-white/5"
              >
                <i className={`fas ${isConverting ? 'fa-spinner animate-spin' : 'fa-file-pdf text-red-500'}`}></i> 
                {isConverting ? 'Converting...' : 'To PDF'}
              </button>
              <button 
                onClick={simulatePrint}
                disabled={isPrinting}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all border border-white/5"
              >
                <i className={`fas ${isPrinting ? 'fa-spinner animate-spin' : 'fa-print text-blue-400'}`}></i>
                {isPrinting ? 'Printing...' : 'Sync Print'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-20 md:w-64 bg-slate-950/80 backdrop-blur-md border-r border-white/5 flex flex-col p-4 gap-2">
          <button className="flex items-center gap-4 p-4 bg-blue-600/20 text-blue-500 rounded-2xl font-black transition-all border border-blue-500/20">
            <i className="fas fa-inbox text-lg"></i> 
            <span className="hidden md:block text-xs uppercase tracking-widest">Inbox</span>
            <span className="hidden md:block ml-auto bg-blue-500 text-white text-[9px] px-2 py-0.5 rounded-full">12</span>
          </button>
          <button className="flex items-center gap-4 p-4 hover:bg-white/5 text-slate-500 rounded-2xl transition-all group">
            <i className="fas fa-paper-plane text-lg group-hover:text-white"></i> 
            <span className="hidden md:block text-xs uppercase tracking-widest font-bold group-hover:text-white">Sent</span>
          </button>
          <button className="flex items-center gap-4 p-4 hover:bg-white/5 text-slate-500 rounded-2xl transition-all group">
            <i className="fas fa-file-signature text-lg group-hover:text-white"></i> 
            <span className="hidden md:block text-xs uppercase tracking-widest font-bold group-hover:text-white">Drafts</span>
          </button>
          <button className="flex items-center gap-4 p-4 hover:bg-white/5 text-slate-500 rounded-2xl transition-all group">
            <i className="fas fa-trash-can text-lg group-hover:text-red-500"></i> 
            <span className="hidden md:block text-xs uppercase tracking-widest font-bold group-hover:text-white">Trash</span>
          </button>

          <div className="mt-auto p-4 bg-slate-900 rounded-[32px] border border-white/5 text-center hidden md:block">
            <div className="mb-3">
              <i className="fas fa-print text-2xl text-slate-700 mb-1"></i>
              <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Printer Online</p>
            </div>
            <div className="h-1 bg-slate-800 rounded-full mb-3 overflow-hidden">
              <div className="w-2/3 h-full bg-blue-500"></div>
            </div>
            <p className="text-[9px] text-blue-400 font-bold">Node 401-Sync Active</p>
          </div>
        </div>

        {/* Content View */}
        <div className="flex-1 flex flex-col bg-slate-900/40">
          {view === 'LIST' && (
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-white/5 bg-slate-950/20">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Recent Correspondence</p>
              </div>
              {emails.map(email => (
                <div 
                  key={email.id} 
                  onClick={() => handleReadEmail(email)}
                  className={`p-6 border-b border-white/5 flex gap-5 cursor-pointer transition-all hover:bg-white/5 relative group ${!email.read ? 'bg-blue-600/5' : ''}`}
                >
                  {!email.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_blue]"></div>}
                  <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-lg border border-white/10 shadow-lg ${!email.read ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {email.sender.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`text-sm tracking-tight ${!email.read ? 'font-black text-white' : 'font-bold text-slate-400'}`}>{email.sender}</h4>
                      <span className="text-[10px] font-bold text-slate-600 uppercase">{email.timestamp}</span>
                    </div>
                    <p className={`text-xs mb-1 truncate ${!email.read ? 'text-blue-400 font-black' : 'text-slate-300 font-bold'}`}>{email.subject}</p>
                    <p className="text-[11px] text-slate-500 truncate font-medium">{email.snippet}</p>
                  </div>
                  {email.hasAttachment && (
                    <div className="flex items-center text-slate-600 group-hover:text-blue-400">
                      <i className="fas fa-paperclip"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {view === 'READ' && selectedEmail && (
            <div className="flex-1 flex flex-col p-8 overflow-y-auto">
              <div className="max-w-4xl mx-auto w-full space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-white tracking-tighter leading-none">{selectedEmail.subject}</h3>
                    <div className="flex items-center gap-2 pt-2">
                      <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-md text-[9px] font-black uppercase tracking-widest">Official Sync</span>
                      <span className="text-[10px] text-slate-500 font-bold">{selectedEmail.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-6 border-y border-white/5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xl font-black border border-white/10">{selectedEmail.sender.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-black text-white">{selectedEmail.sender}</p>
                    <p className="text-[11px] text-slate-500 font-bold uppercase">To: Neural-Admin (You)</p>
                  </div>
                </div>

                <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-medium p-6 bg-slate-950/40 rounded-3xl border border-white/5 shadow-inner">
                  {selectedEmail.content}
                </div>

                {selectedEmail.hasAttachment && (
                  <div className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-800 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500"><i className="fas fa-file-pdf"></i></div>
                      <div>
                        <p className="text-xs font-black text-white">attachment_manifest_v2.pdf</p>
                        <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">2.4 MB • Secure Scan Complete</p>
                      </div>
                    </div>
                    <button className="text-slate-500 group-hover:text-blue-500 transition-colors"><i className="fas fa-download"></i></button>
                  </div>
                )}
                
                <div className="flex gap-4 pt-12">
                  <button className="px-8 py-3 bg-white text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Reply</button>
                  <button className="px-8 py-3 bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest border border-white/5 hover:bg-slate-700 transition-all">Forward</button>
                </div>
              </div>
            </div>
          )}

          {view === 'COMPOSE' && (
            <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-slate-950/40">
              <div className="max-w-4xl mx-auto w-full space-y-6 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Draft Correspondence</h3>
                  <div className="flex gap-2">
                    <button onClick={handleAttach} className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-blue-500" title="Attach Document"><i className="fas fa-paperclip"></i></button>
                    <button onClick={simulatePDFConvert} className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-red-500" title="Convert to PDF"><i className="fas fa-file-pdf"></i></button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center border-b border-white/10 py-4 gap-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase w-12 tracking-widest">To</span>
                    <input className="bg-transparent border-none focus:ring-0 flex-1 text-sm font-bold placeholder:text-slate-700" placeholder="Recipient address or RoboNode ID" />
                  </div>
                  <div className="flex items-center border-b border-white/10 py-4 gap-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase w-12 tracking-widest">Sub</span>
                    <input className="bg-transparent border-none focus:ring-0 flex-1 text-sm font-bold placeholder:text-slate-700" placeholder="Message Subject" />
                  </div>
                </div>

                <textarea 
                  className="w-full flex-1 bg-slate-900/50 rounded-3xl p-6 border border-white/5 focus:border-blue-500 transition-colors text-sm font-medium resize-none min-h-[300px]"
                  placeholder="Initiate communication protocol here..."
                ></textarea>

                {attachmentName && (
                  <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-file text-blue-500"></i>
                      <span className="text-xs font-bold text-blue-400">{attachmentName} attached</span>
                    </div>
                    <button onClick={() => setAttachmentName(null)} className="text-slate-500 hover:text-red-500"><i className="fas fa-times"></i></button>
                  </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                  <button onClick={() => setView('LIST')} className="px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Discard</button>
                  <button 
                    onClick={() => { alert("Neural Signal Dispatched Successfully."); setView('LIST'); }}
                    className="px-12 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
                  >
                    Transmit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxModule;
