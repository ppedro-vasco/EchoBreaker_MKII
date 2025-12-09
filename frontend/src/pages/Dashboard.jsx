import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import { LogOut, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  // Função chamada quando o usuário envia o arquivo no componente filho
  const handleAnalysis = async (file) => {
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Chama o nosso Backend
      const response = await api.post('/analysis/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysisResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Falha ao processar o arquivo. Verifique se é um JSON válido.');
    }
  };

  // Renderiza a severidade com cores e ícones
  const renderSeverity = (sev) => {
    if (sev === 'Alta') return <span className="text-alert-red flex items-center gap-2"><AlertTriangle/> CRÍTICA (Bolha Fechada)</span>;
    if (sev === 'Média') return <span className="text-yellow-500 flex items-center gap-2"><RefreshCw/> MODERADA</span>;
    return <span className="text-hacker-green flex items-center gap-2"><CheckCircle/> SAUDÁVEL (Baixa)</span>;
  };

  return (
    <div className="min-h-screen p-6 relative z-10">
      
      {/* Header Simples */}
      <div className="flex justify-between items-center mb-12 border-b border-green-900 pb-4">
        <div>
          <h1 className="text-2xl text-hacker-green font-mono tracking-tighter">
            DASHBOARD_OPERACIONAL
          </h1>
          <p className="text-xs text-green-800">Usuário: {user?.username || 'Desconhecido'}</p>
        </div>
        <button 
          onClick={logout} 
          className="text-green-800 hover:text-red-500 text-xs uppercase flex items-center gap-2 transition-colors"
        >
          <LogOut size={14} /> Encerrar Sessão
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-5xl mx-auto">
        
        {error && (
          <div className="mb-8 bg-red-900 bg-opacity-20 border border-alert-red p-4 text-alert-red text-center">
            {error}
          </div>
        )}

        {/* Estado 1: Tela de Upload (Se não tiver resultado ainda) */}
        {!analysisResult ? (
          <div className="animate-fade-in">
            <h2 className="text-center text-green-600 mb-2 uppercase tracking-widest text-sm">
              Injetar Dados para Análise
            </h2>
            <FileUpload onUploadSuccess={handleAnalysis} />
          </div>
        ) : (
          
          /* Estado 2: Tela de Resultados */
          <div className="animate-slide-up space-y-8">
            
            {/* Card de Diagnóstico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black bg-opacity-80 border border-green-800 p-6 shadow-neon">
                <h3 className="text-green-900 text-xs uppercase mb-2">Índice de Entropia de Shannon</h3>
                <div className="text-5xl font-bold text-white mb-2">{analysisResult.analysis.entropy}</div>
                <div className="text-sm font-mono uppercase">
                   Severidade: {renderSeverity(analysisResult.analysis.severity)}
                </div>
              </div>

              <div className="bg-black bg-opacity-80 border border-green-800 p-6">
                 <h3 className="text-green-900 text-xs uppercase mb-4">Categorias Dominantes (Top 5)</h3>
                 <ul className="space-y-2">
                   {Object.entries(analysisResult.analysis.details).map(([catId, count], idx) => (
                     <li key={idx} className="flex justify-between text-sm border-b border-green-900 border-opacity-30 pb-1">
                        <span className="text-green-400">Cat ID {catId}</span>
                        <span className="text-white font-bold">{count} vídeos</span>
                     </li>
                   ))}
                 </ul>
              </div>
            </div>

            {/* Lista de Recomendações */}
            <div>
              <h2 className="text-hacker-green text-xl mb-6 border-l-4 border-hacker-green pl-4 uppercase">
                 Protocolo de Diversificação (Recomendações)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analysisResult.suggestions.map((video) => (
                  <div key={video.video_id} className="bg-green-900 bg-opacity-10 border border-green-800 p-4 hover:bg-opacity-20 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] text-green-600 bg-black px-2 py-1 rounded border border-green-900">
                         {video.category_name}
                       </span>
                       <span className="text-[10px] text-green-800">
                         {Math.floor(video.duration_seconds / 60)} min
                       </span>
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1 line-clamp-2 group-hover:text-hacker-green">
                      {video.title}
                    </h4>
                    <p className="text-green-700 text-xs mb-3">{video.channel}</p>
                    
                    <a 
                      href={`https://www.youtube.com/watch?v=${video.video_id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-center text-xs bg-green-900 text-green-100 py-2 hover:bg-hacker-green hover:text-black transition-colors uppercase font-bold"
                    >
                      Acessar Conteúdo {'>'}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
               <Button onClick={() => setAnalysisResult(null)}>
                  Realizar Nova Análise
               </Button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;