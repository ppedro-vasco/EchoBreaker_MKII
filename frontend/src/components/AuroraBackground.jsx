import { useMemo } from 'react';

const AuroraBackground = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90}%`, // Evita borda extrema direita
      size: Math.random() * 20 + 10,   // Tamanho maior para ver melhor (10px a 30px)
      delay: `${Math.random() * 10}s`, // Menor delay inicial
      duration: `${Math.random() * 5 + 8}s`, // Mais rápido (8s a 13s)
      digit: Math.random() > 0.5 ? '1' : '0'
    }));
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-deep-space">
      
      {/* Camada de Fundo */}
      <div className="absolute inset-0 bg-deep-space opacity-90"></div>
      <div className="absolute top-[-10%] -left-10 w-[40rem] h-[40rem] bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] -right-10 w-[35rem] h-[35rem] bg-cyan-600 rounded-full mix-blend-screen filter blur-[80px] opacity-25 animate-blob animation-delay-4000"></div>

      {/* Partículas */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute flex items-center justify-center pointer-events-none"
          style={{
            left: p.left,
            top: '100%', // COMEÇA ABAIXO DA TELA
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `rise ${p.duration} linear infinite`,
            animationDelay: p.delay,
          }}
        >
          {/* Bolha */}
          <div 
            className="absolute inset-0 rounded-full bg-aero-blue/20 border border-aero-blue/40 shadow-[0_0_15px_rgba(0,240,255,0.3)] backdrop-blur-sm"
            style={{
              animation: `pop ${p.duration} linear infinite`,
              animationDelay: p.delay,
            }}
          />

          {/* Dígito */}
          <span
            className="absolute text-aero-blue font-mono font-bold select-none"
            style={{
              fontSize: `${p.size}px`,
              animation: `digit ${p.duration} linear infinite`,
              animationDelay: p.delay,
            }}
          >
            {p.digit}
          </span>
        </div>
      ))}
      
      {/* Textura */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
    </div>
  );
};

export default AuroraBackground;