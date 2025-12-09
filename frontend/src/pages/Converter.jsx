import { useState } from 'react';
import api from '../services/api';
import Button from '../components/Button';

const Converter = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/tools/convert-txt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ type: 'success', data: response.data });
    } catch (error) {
      setStatus({ type: 'error', msg: error.response?.data?.error || 'Erro na conversão' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 pt-20 flex flex-col items-center">
      <div className="max-w-xl w-full bg-black border border-green-800 p-8 shadow-neon">
        <h1 className="text-2xl text-hacker-green font-mono mb-6 border-b border-green-900 pb-2">
          FERRAMENTA: TXT to JSON
        </h1>
        
        <p className="text-green-700 text-sm mb-6">
          Utilize esta ferramenta interna para converter listas de URLs (.txt) 
          em datasets estruturados (.json) para o sistema.
        </p>

        <div className="mb-6">
          <input 
            type="file" 
            accept=".txt"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-green-500
              file:mr-4 file:py-2 file:px-4
              file:border-0
              file:text-sm file:font-semibold
              file:bg-green-900 file:text-black
              hover:file:bg-hacker-green
            "
          />
        </div>

        <Button onClick={handleUpload} loading={loading}>
          {loading ? 'PROCESSANDO METADADOS (YT-DLP)...' : 'CONVERTER E SALVAR'}
        </Button>

        {status && (
          <div className={`mt-6 p-4 border text-xs font-mono ${status.type === 'error' ? 'border-red-500 text-red-500' : 'border-green-500 text-green-400'}`}>
            {status.type === 'error' ? (
              <p>[ERRO] {status.msg}</p>
            ) : (
              <div>
                <p className="font-bold mb-2">[SUCESSO] ARQUIVO GERADO!</p>
                <p>Vídeos Processados: {status.data.details.total_processed}</p>
                <p>Caminho no Servidor:</p>
                <code className="bg-green-900 bg-opacity-20 p-1 block mt-1 break-all">
                  {status.data.details.path}
                </code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Converter;