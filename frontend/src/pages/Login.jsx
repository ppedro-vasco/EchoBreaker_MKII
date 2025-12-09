import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { Disc3 } from 'lucide-react'; // Ícone estilo "CD/Loading"

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro de conexão.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 z-10 relative">
      
      {/* Card de Vidro */}
      <div className="w-full max-w-md glass-panel p-10 relative overflow-hidden animate-fade-in">
        
        {/* Glow de fundo no card */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/5 to-transparent pointer-events-none rotate-12"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 mb-4 shadow-glow">
            <Disc3 className="w-8 h-8 text-white animate-spin-slow" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">
            Echo<span className="text-aero-blue">Breaker</span>
          </h1>
          <p className="text-blue-200/60 text-sm mt-2 font-light">
            Análise de Espectro Informacional v2.0
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          <Input 
            label="ID de Usuário" 
            placeholder="cientista@tcc.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Input 
            label="Chave de Acesso" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="pt-4">
            <Button type="submit" loading={isSubmitting}>
              Conectar ao Sistema
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-white/20 text-xs font-display tracking-widest">
        SYSTEM READY // WAITING FOR INPUT
      </div>
    </div>
  );
};

export default Login;