import { useState } from 'react';
import { Upload, FileJson, Loader2 } from 'lucide-react';
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
    if (selectedFile.type !== "application/json" && !selectedFile.name.endsWith('.json')) {
      setError('Apenas arquivos .json são permitidos.');
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    
    // Simula envio para o pai (Dashboard) tratar a lógica de API
    // Mantemos este componente "burro" (apenas visual), o pai que chama a API
    await onUploadSuccess(file);
    
    setUploading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div 
        className={`
          relative border-2 border-dashed rounded-lg p-10 text-center transition-all
          ${dragActive ? 'border-hacker-green bg-hacker-green bg-opacity-10' : 'border-green-900 hover:border-green-700'}
          ${file ? 'border-solid border-hacker-green' : ''}
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
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <Upload className="w-12 h-12 text-green-700 mb-4" />
            <p className="text-lg text-hacker-green font-bold mb-2">
              Arraste seu histórico.json aqui
            </p>
            <p className="text-xs text-green-800">
              ou clique para selecionar do computador
            </p>
          </label>
        ) : (
          <div className="flex flex-col items-center animate-pulse">
            <FileJson className="w-12 h-12 text-hacker-green mb-4" />
            <p className="text-lg text-white font-mono mb-1">{file.name}</p>
            <p className="text-xs text-green-600">{(file.size / 1024).toFixed(2)} KB</p>
            
            <button 
              onClick={(e) => { e.preventDefault(); setFile(null); }}
              className="mt-4 text-xs text-red-500 hover:underline uppercase"
            >
              Remover Arquivo
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 text-alert-red text-xs text-center border border-alert-red p-2">
          [ERRO] {error}
        </div>
      )}

      {file && (
        <div className="mt-6">
          <Button onClick={handleSubmit} loading={uploading}>
            {uploading ? 'Processando Análise...' : 'INICIAR DIAGNÓSTICO'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;