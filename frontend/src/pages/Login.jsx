import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

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
      navigate('/dashboard'); // Redireciona se der certo
    } catch (err) {
      // Captura mensagem de erro do Backend ou define uma padrão
      const msg = err.response?.data?.error || 'Falha na conexão com o servidor.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 z-20 relative">
      
      {/* Card de Login */}
      <div className="w-full max-w-md bg-black bg-opacity-90 border border-green-800 p-8 shadow-[0_0_20px_rgba(0,255,0,0.1)] backdrop-blur-sm">
        
        <h1 className="text-3xl font-mono text-hacker-green mb-2 text-center tracking-tighter">
          ECHO_BREAKER<span className="animate-pulse">_</span>
        </h1>
        <p className="text-green-800 text-xs text-center mb-8 uppercase border-b border-green-900 pb-4">
          Sistema de Acesso Seguro v2.0
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-2 border border-alert-red text-alert-red text-xs bg-red-900 bg-opacity-10">
              [ERRO] {error}
            </div>
          )}

          <Input 
            label="Identificação (Email)" 
            placeholder="usuario@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Input 
            label="Chave de Acesso (Senha)" 
            type="password" 
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="mt-6">
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? 'Autenticando...' : 'Iniciar Sessão'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-green-900 text-xs">
            Não possui credenciais?{' '}
            <button 
              onClick={() => alert('Registro será implementado em breve!')}
              className="text-hacker-green hover:underline"
            >
              Solicitar Acesso
            </button>
          </p>
        </div>

      </div>
      
      {/* Footer decorativo */}
      <div className="absolute bottom-4 text-green-900 text-[10px] font-mono">
        CONEXÃO SEGURA :: CRIPTOGRAFIA ATIVA :: NODE_RJ_01
      </div>
    </div>
  );
};

export default Login;