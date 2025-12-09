import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import FileUpload from '../components/FileUpload';
import Button from '../components/Button';
import AnalysisLoader from '../components/AnalysisLoader';
import { LogOut, AlertTriangle, CheckCircle, RefreshCw, ListVideo, BarChart3 } from 'lucide-react';

// Importações do Gráfico
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Mapa de Tradução de Categorias (YouTube API Standard)
const CATEGORY_NAMES = {
  1: "Filmes e Animação",
  2: "Automóveis",
  10: "Música",
  15: "Animais e Pets",
  17: "Esportes",
  19: "Viagens e Eventos",
  20: "Jogos (Gaming)",
  22: "Pessoas e Blogs",
  23: "Comédia",
  24: "Entretenimento",
  25: "Notícias e Política",
  26: "Estilo e Tutoriais",
  27: "Educação",
  28: "Ciência e Tecnologia",
  29: "Ativismo e ONGs",
};

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysis = async (file) => {
    setError('');
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const [response] = await Promise.all([
        api.post('/analysis/analyze', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        new Promise(resolve => setTimeout(resolve, 3000))
      ]);
      setAnalysisResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Falha ao processar arquivo. O sistema aceita apenas .json ou .txt convertidos.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderSeverity = (sev) => {
    if (sev === 'Alta') return <span className="text-red-300 font-bold flex items-center gap-2 drop-shadow-md"><AlertTriangle size={18}/> CRÍTICA (Bolha Fechada)</span>;
    if (sev === 'Média') return <span className="text-yellow-300 font-bold flex items-center gap-2 drop-shadow-md"><RefreshCw size={18}/> MODERADA</span>;
    return <span className="text-cyan-300 font-bold flex items-center gap-2 drop-shadow-md"><CheckCircle size={18}/> SAUDÁVEL (Baixa)</span>;
  };

  // Prepara os dados para o Gráfico de Radar
  const getChartData = () => {
    if (!analysisResult) return [];
    // Transforma o objeto { "20": 10, "10": 5 } em array [{ subject: 'Jogos', A: 10 }, ...]
    return Object.entries(analysisResult.analysis.details).map(([catId, count]) => ({
      subject: CATEGORY_NAMES[catId] || `ID ${catId}`, // Usa o nome ou o ID se não achar
      A: count,
      fullMark: 100, // Escala
    }));
  };

  return (
    <div className="min-h-screen p-6 relative z-10 font-sans text-white">
      
      {isAnalyzing && <AnalysisLoader />}

      {/* Header Social */}
      <div className="flex justify-between items-center mb-12 glass-panel p-4 rounded-full border border-white/20 shadow-glass">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/f/f4/Daffy_Duck.svg" 
              alt="Avatar" 
              className="relative w-12 h-12 rounded-full object-cover object-top border-2 border-white/50 bg-white"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full shadow-[0_0_8px_rgba(0,255,0,0.8)]"></span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white leading-none tracking-wide drop-shadow-sm">
              {user?.username || 'Visitante'}
            </h1>
            <p className="text-xs text-cyan-200 font-medium tracking-widest uppercase opacity-80">
              Operador de Sistema
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 pr-4">
          <button 
            onClick={logout} 
            className="text-white/70 hover:text-red-300 hover:bg-white/10 p-2 rounded-full transition-all group"
            title="Encerrar Sessão"
          >
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-400/30 backdrop-blur-md p-4 rounded-xl text-red-200 text-center shadow-lg">
            {error}
          </div>
        )}

        {!analysisResult ? (
          <div className="animate-fade-in glass-panel p-10 max-w-3xl mx-auto text-center border-white/10">
            <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
              Análise de Espectro
            </h2>
            <p className="text-blue-200/70 mb-8 max-w-md mx-auto">
              Carregue o histórico de navegação para diagnosticar padrões de consumo.
            </p>
            <FileUpload onUploadSuccess={handleAnalysis} />
          </div>
        ) : (
          <div className="animate-slide-up space-y-8">
            
            {/* Grid de Diagnóstico e Gráfico */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Gráfico de Radar (Perfil da Bolha) */}
              <div className="glass-panel p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[350px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                
                <h3 className="text-cyan-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2 w-full">
                    <BarChart3 size={16}/> Topologia da Bolha
                </h3>

                {/* O GRÁFICO DE RADAR AQUI */}
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getChartData()}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#a5f3fc', fontSize: 10 }} />
                      <Radar
                        name="Vídeos"
                        dataKey="A"
                        stroke="#00f0ff"
                        strokeWidth={2}
                        fill="#00f0ff"
                        fillOpacity={0.3}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #00f0ff', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#00f0ff' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2 text-center">
                   <p className="text-xs text-blue-200/50 uppercase tracking-widest">Entropia Calculada</p>
                   <p className="text-2xl font-bold text-white drop-shadow-glow">{analysisResult.analysis.entropy}</p>
                </div>
              </div>

              {/* Card 2: Lista de Categorias (Com nomes reais) */}
              <div className="glass-panel p-8 relative overflow-hidden">
                 <h3 className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
                    <ListVideo size={16}/> Dominância Categórica
                 </h3>
                 <div className="space-y-3">
                   {Object.entries(analysisResult.analysis.details).map(([catId, count], idx) => (
                     <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex flex-col">
                            {/* Tradução do ID para Nome aqui */}
                            <span className="text-cyan-100 font-bold text-sm">
                                {CATEGORY_NAMES[catId] || `Categoria ${catId}`}
                            </span>
                            <span className="text-[10px] text-blue-300/50">ID: {catId}</span>
                        </div>
                        <span className="bg-blue-600/30 px-3 py-1 rounded-full text-xs font-bold border border-blue-400/30">
                            {count} vídeos
                        </span>
                     </div>
                   ))}
                 </div>
                 
                 <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    {renderSeverity(analysisResult.analysis.severity)}
                 </div>
              </div>
            </div>

            {/* Recomendações */}
            <div className="glass-panel p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
                 <span className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></span>
                 Sugestões para Furar a Bolha
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {analysisResult.suggestions.map((video) => (
                  <div key={video.video_id} className="group relative bg-surface-dark border border-white/5 rounded-xl p-5 hover:border-aero-blue/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-3">
                           <span className="text-[10px] font-bold text-blue-900 bg-cyan-400 px-2 py-1 rounded shadow-sm truncate max-w-[70%]">
                             {video.category_name}
                           </span>
                           <span className="text-[10px] text-white/50 bg-white/10 px-2 py-1 rounded">
                             {Math.floor(video.duration_seconds / 60)} min
                           </span>
                        </div>
                        
                        <h4 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-aero-blue transition-colors line-clamp-2">
                          {video.title}
                        </h4>
                        
                        <p className="text-blue-200/60 text-xs mb-5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span> {video.channel}
                        </p>
                        
                        <a 
                          href={`https://www.youtube.com/watch?v=${video.video_id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block w-full text-center py-3 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-aero-blue hover:text-black hover:border-aero-blue transition-all uppercase tracking-wider"
                        >
                          Assistir
                        </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-8 pb-12">
               <Button onClick={() => setAnalysisResult(null)} variant="secondary" className="max-w-sm mx-auto">
                  Reiniciar Diagnóstico
               </Button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;