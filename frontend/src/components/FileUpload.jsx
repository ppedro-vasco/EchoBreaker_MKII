import { useState } from 'react';
import { Upload, FileJson, XCircle } from 'lucide-react'; // Adicionei XCircle para remover
import Button from './Button';

const FileUpload = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Manipula o arrastar e soltar (Drag & Drop)
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    // Mantendo a lógica original que você enviou (apenas JSON)
    if (selectedFile.type !== "application/json" && !selectedFile.name.endsWith('.json')) {
      setError('Apenas arquivos .json são permitidos.');
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    await onUploadSuccess(file);
    setUploading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ease-out
          ${dragActive 
            ? 'border-aero-blue bg-aero-blue/10 shadow-glow scale-[1.02]' 
            : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
          }
          ${file ? 'border-solid border-aero-blue/50 bg-black/20' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          id="file-upload" 
          className="hidden" 
          onChange={handleChange}
          accept=".json"
        />

        {!file ? (
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center group">
            
            {/* Ícone com fundo brilhante */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 group-hover:border-aero-blue/50 transition-all duration-300 shadow-glass">
                <Upload className="w-10 h-10 text-aero-blue drop-shadow-md" />
            </div>

            <p className="text-xl text-white font-display font-bold mb-2 tracking-wide group-hover:text-aero-blue transition-colors">
              Arraste seu arquivo JSON
            </p>
            <p className="text-sm text-blue-200/60 font-sans">
              ou clique para explorar arquivos locais
            </p>
          </label>
        ) : (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="relative">
                <div className="absolute inset-0 bg-aero-blue/20 blur-xl rounded-full"></div>
                <FileJson className="relative w-20 h-20 text-aero-blue mb-4 drop-shadow-glow" />
            </div>
            
            <p className="text-xl text-white font-display font-bold mb-2 tracking-wide">
                {file.name}
            </p>
            
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-blue-200 font-mono mb-6">
                {(file.size / 1024).toFixed(2)} KB
            </span>
            
            <button 
              onClick={(e) => { e.preventDefault(); setFile(null); }}
              className="text-sm text-red-300 hover:text-red-100 flex items-center gap-2 transition-colors py-2 px-4 rounded-lg hover:bg-red-500/10"
            >
              <XCircle size={16} /> Remover Arquivo
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm text-center backdrop-blur-md shadow-lg animate-fade-in">
          ⚠️ {error}
        </div>
      )}

      {file && (
        <div className="mt-8 animate-slide-up">
          <Button onClick={handleSubmit} loading={uploading}>
            {uploading ? 'Processando Dados...' : 'Iniciar Diagnóstico'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;