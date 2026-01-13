
import React, { useState } from 'react';

interface FileObject {
  id: string;
  name: string;
  type: 'pdf' | 'jpg' | 'mp4' | 'license';
  category: 'Document' | 'Photo' | 'Video';
  url: string;
  isPrivate?: boolean;
}

interface FilesModuleProps {
  onBack: () => void;
}

const FilesModule: React.FC<FilesModuleProps> = ({ onBack }) => {
  const [view, setView] = useState<'ROOT' | 'DOCS' | 'PHOTOS' | 'VIDEOS'>('ROOT');
  const [selectedFile, setSelectedFile] = useState<FileObject | null>(null);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [files, setFiles] = useState<FileObject[]>([
    { id: 'f1', name: 'Identity_Card.pdf', type: 'pdf', category: 'Document', url: 'https://picsum.photos/seed/doc1/400/600' },
    { id: 'f2', name: 'Driving_License.license', type: 'license', category: 'Document', url: 'https://picsum.photos/seed/license/400/250' },
    { id: 'f3', name: 'Sunset_Node.jpg', type: 'jpg', category: 'Photo', url: 'https://picsum.photos/seed/photo1/800/600' },
    { id: 'f4', name: 'Cyber_City_Trip.mp4', type: 'mp4', category: 'Video', url: 'https://picsum.photos/seed/vid1/800/450', isPrivate: true },
    { id: 'f5', name: 'Robot_Maintenance.pdf', type: 'pdf', category: 'Document', url: 'https://picsum.photos/seed/doc2/400/600' },
    { id: 'f6', name: 'Friend_Bot_Group.jpg', type: 'jpg', category: 'Photo', url: 'https://picsum.photos/seed/photo2/800/600' },
    { id: 'f7', name: 'Public_Broadcast_01.mp4', type: 'mp4', category: 'Video', url: 'https://picsum.photos/seed/vid2/800/450', isPrivate: false },
  ]);

  const handleShare = (target: string) => {
    if (!selectedFile) return;
    alert(`Syncing "${selectedFile.name}" to ${target} node. Broadcast initialized.`);
    setShowShareModal(false);
  };

  const folders = [
    { id: 'DOCS', name: 'Documents', count: files.filter(f => f.category === 'Document').length, icon: 'fa-file-lines', color: 'text-blue-500' },
    { id: 'PHOTOS', name: 'Photos', count: files.filter(f => f.category === 'Photo').length, icon: 'fa-image', color: 'text-purple-500' },
    { id: 'VIDEOS', name: 'Videos', count: files.filter(f => f.category === 'Video').length, icon: 'fa-film', color: 'text-red-500' },
  ];

  const renderFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <i className="fas fa-file-pdf text-red-500"></i>;
      case 'license': return <i className="fas fa-id-card text-blue-400"></i>;
      case 'mp4': return <i className="fas fa-video text-purple-400"></i>;
      default: return <i className="fas fa-file-image text-green-400"></i>;
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 flex flex-col font-sans text-white overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button 
            onClick={view === 'ROOT' ? onBack : () => setView('ROOT')} 
            className="w-12 h-12 flex items-center justify-center hover:bg-slate-800 rounded-2xl border border-white/10 transition-all active:scale-90"
          >
            <i className="fas fa-arrow-left text-blue-400"></i>
          </button>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Neural Filesystem</h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">{view === 'ROOT' ? 'Root Directory' : `Root / ${view}`}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="w-12 h-12 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all"><i className="fas fa-search"></i></button>
          <button className="w-12 h-12 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all"><i className="fas fa-gear"></i></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        {view === 'ROOT' && (
          <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {folders.map(f => (
                <button 
                  key={f.id} 
                  onClick={() => setView(f.id as any)}
                  className="bg-slate-900/50 p-10 rounded-[40px] border border-white/5 flex flex-col items-center gap-6 hover:bg-slate-900 hover:border-blue-500/30 transition-all group shadow-2xl active:scale-95"
                >
                  <div className={`w-24 h-24 rounded-[32px] bg-slate-950 flex items-center justify-center text-5xl shadow-inner ${f.color} group-hover:scale-110 transition-transform`}>
                    <i className={`fas ${f.icon}`}></i>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-black">{f.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{f.count} Neural Assets</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-slate-900/30 p-8 rounded-[40px] border border-white/5">
              <h3 className="text-sm font-black text-slate-600 uppercase tracking-[0.3em] mb-8 flex items-center gap-3"><i className="fas fa-clock-rotate-left"></i> Recent Global Syncs</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {files.slice(0, 6).map(f => (
                  <div key={f.id} onClick={() => { setSelectedFile(f); setShowShareModal(true); }} className="aspect-square bg-slate-800 rounded-3xl overflow-hidden relative group cursor-pointer border border-white/5 hover:border-blue-500 transition-all">
                    <img src={f.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      <p className="text-[9px] font-black truncate text-white">{f.name}</p>
                    </div>
                    <div className="absolute top-2 right-2 w-6 h-6 bg-black/40 backdrop-blur rounded-lg flex items-center justify-center text-[10px]">
                      {renderFileIcon(f.type)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'DOCS' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-300">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black uppercase tracking-tight">Personal Documents Vault</h3>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Upload Document</button>
             </div>
             <div className="space-y-3">
                {files.filter(f => f.category === 'Document').map(doc => (
                  <div key={doc.id} className="bg-slate-900 border border-white/5 p-4 rounded-3xl flex items-center gap-4 group hover:bg-slate-800 transition-all cursor-pointer">
                    <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-2xl">
                      {renderFileIcon(doc.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{doc.name}</h4>
                      <p className="text-[10px] text-slate-500 font-black uppercase">{doc.type === 'license' ? 'Credential Module' : 'Portable Document'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setSelectedFile(doc); setShowShareModal(true); }} className="w-10 h-10 bg-slate-950 rounded-xl text-slate-500 hover:text-blue-500 transition-colors"><i className="fas fa-share-nodes"></i></button>
                      <button className="w-10 h-10 bg-slate-950 rounded-xl text-slate-500 hover:text-white transition-colors"><i className="fas fa-download"></i></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'PHOTOS' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-300">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tight">Neural Image Repository</h3>
                <div className="flex gap-3">
                  <button className="p-3 bg-slate-900 rounded-2xl text-slate-500"><i className="fas fa-filter"></i></button>
                  <button className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Capture Photo</button>
                </div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {files.filter(f => f.category === 'Photo').map(photo => (
                  <div key={photo.id} className="group relative aspect-square bg-slate-900 rounded-[32px] overflow-hidden border border-white/5 hover:border-purple-500 transition-all">
                    <img src={photo.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                      <p className="text-xs font-black truncate mb-4">{photo.name}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setSelectedFile(photo); setIsEditingPhoto(true); }}
                          className="flex-1 py-2 bg-white text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                        >
                          Edit Image
                        </button>
                        <button 
                          onClick={() => { setSelectedFile(photo); setShowShareModal(true); }}
                          className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all shadow-lg"
                        >
                          <i className="fas fa-share-nodes"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'VIDEOS' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-300">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tight">Broadcasting Hub</h3>
                <button className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Import Clip</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {files.filter(f => f.category === 'Video').map(vid => (
                  <div key={vid.id} className="group flex flex-col gap-4">
                    <div className="aspect-video bg-slate-900 rounded-[40px] overflow-hidden relative border border-white/5 shadow-2xl">
                      <img src={vid.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                          <i className="fas fa-play text-xl text-white"></i>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg ${vid.isPrivate ? 'bg-orange-600 text-white' : 'bg-green-600 text-white'}`}>
                          {vid.isPrivate ? 'Private' : 'Public'}
                        </span>
                      </div>
                    </div>
                    <div className="px-2 flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-sm">{vid.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Neural Video Protocol</p>
                      </div>
                      <button onClick={() => { setSelectedFile(vid); setShowShareModal(true); }} className="w-10 h-10 bg-slate-900 rounded-xl text-slate-500 hover:text-red-500 transition-all border border-white/5"><i className="fas fa-share-nodes"></i></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Global Share/Sync Modal */}
      {showShareModal && selectedFile && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-md p-8 rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] space-y-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Sync Asset</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Target Selection Mode</p>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-slate-500 hover:text-white"><i className="fas fa-times text-xl"></i></button>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-950 rounded-3xl border border-white/5">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800">
                <img src={selectedFile.url} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">Sync ID: {selectedFile.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleShare('Email Inbox')} className="flex flex-col items-center gap-3 p-6 bg-slate-800 rounded-[32px] hover:bg-red-600 transition-all group">
                <i className="fas fa-envelope text-2xl group-hover:scale-125 transition-transform"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">Inbox</span>
              </button>
              <button onClick={() => handleShare('Content Feed')} className="flex flex-col items-center gap-3 p-6 bg-slate-800 rounded-[32px] hover:bg-purple-600 transition-all group">
                <i className="fas fa-clapperboard text-2xl group-hover:scale-125 transition-transform"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">Content</span>
              </button>
              <button onClick={() => handleShare('AI Assistant')} className="flex flex-col items-center gap-3 p-6 bg-slate-800 rounded-[32px] hover:bg-blue-600 transition-all group">
                <i className="fas fa-robot text-2xl group-hover:scale-125 transition-transform"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">AI Chat</span>
              </button>
              <button onClick={() => handleShare('Neural Friends')} className="flex flex-col items-center gap-3 p-6 bg-slate-800 rounded-[32px] hover:bg-green-600 transition-all group">
                <i className="fas fa-comment-dots text-2xl group-hover:scale-125 transition-transform"></i>
                <span className="text-[10px] font-black uppercase tracking-widest">Chat</span>
              </button>
            </div>
            
            <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest">Select target node for neural synchronization</p>
          </div>
        </div>
      )}

      {/* Photo Edit Simulation Modal */}
      {isEditingPhoto && selectedFile && (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col p-6 animate-in slide-in-from-right-20 duration-500">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsEditingPhoto(false)} className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 hover:text-white transition-all"><i className="fas fa-times"></i></button>
                <h3 className="text-2xl font-black uppercase tracking-tight">Neural Image Editor</h3>
              </div>
              <button onClick={() => setIsEditingPhoto(false)} className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">Save Changes</button>
           </div>

           <div className="flex-1 flex flex-col lg:flex-row gap-10 items-center overflow-hidden">
              <div className="flex-[2] w-full h-full flex items-center justify-center bg-black/40 rounded-[60px] border border-white/5 relative group">
                 <img src={selectedFile.url} className="max-w-full max-h-full object-contain rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)]" alt="" />
                 <div className="absolute inset-0 border-[30px] border-slate-950/20 pointer-events-none"></div>
                 {/* Visual HUD overlay */}
                 <div className="absolute top-10 left-10 text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Neural Canvas 5.0</div>
              </div>

              <div className="flex-1 w-full space-y-8">
                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adjustments</h4>
                    <div className="space-y-6">
                       {['Neural Brightness', 'Contrast Sync', 'Saturation Node', 'Sharpness Flux'].map(adj => (
                         <div key={adj} className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                               <span>{adj}</span>
                               <span className="text-white">85%</span>
                            </div>
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                               <div className="w-[85%] h-full bg-blue-500"></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Filters</h4>
                    <div className="grid grid-cols-3 gap-3">
                       {['Cyber', 'Neon', 'Noir', 'Vintage', 'Neural', 'Chrome'].map(filter => (
                         <button key={filter} className="p-3 bg-slate-900 rounded-2xl text-[9px] font-black uppercase tracking-tighter hover:bg-blue-600 transition-all border border-white/5">{filter}</button>
                       ))}
                    </div>
                 </div>

                 <div className="p-6 bg-slate-900 rounded-[32px] border border-white/5">
                    <p className="text-[9px] text-slate-500 font-bold uppercase mb-4">Editing History</p>
                    <div className="flex gap-2">
                       <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
                       <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
                       <div className="w-8 h-8 rounded-lg bg-slate-800 opacity-40"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FilesModule;
