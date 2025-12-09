import { useState, useEffect } from 'react';
import { Loader2, HardDrive, Cpu, Activity } from 'lucide-react';

const steps = [
  { text: "Descriptografando histórico...", icon: HardDrive },
  { text: "Calculando Entropia de Shannon...", icon: Cpu },
  { text: "Identificando padrões de isolamento...", icon: Activity },
  { text: "Consultando Banco de Dados Neural...", icon: Loader2 },
  { text: "Finalizando Relatório...", icon: CheckCircle } // Ícone importado abaixo
];

import { CheckCircle } from 'lucide-react';

const AnalysisLoader = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Troca de texto a cada 800ms para simular progresso
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-space/80 backdrop-blur-xl animate-fade-in">
      
      {/* O Card Central */}
      <div className="relative glass-panel p-12 w-full max-w-md text-center border-white/20 shadow-[0_0_50px_rgba(0,240,255,0.2)]">
        
        {/* Animação de Pulso Atrás */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-aero-blue/20 rounded-full blur-3xl animate-pulse"></div>

        {/* Ícone Mudando */}
        <div className="relative z-10 mb-8 flex justify-center">
            <div className="p-6 rounded-full bg-gradient-to-tr from-blue-500/20 to-cyan-400/20 border border-white/10 shadow-glow animate-bounce duration-[2000ms]">
                <CurrentIcon className="w-12 h-12 text-aero-blue animate-spin-slow" />
            </div>
        </div>

        {/* Texto de Status */}
        <h2 className="text-2xl font-display font-bold text-white mb-2 animate-pulse">
          PROCESSANDO DADOS
        </h2>
        <p className="text-cyan-200 font-mono text-sm h-6">
          {'>'} {steps[currentStep].text}
        </p>

        {/* Barra de Progresso Infinita */}
        <div className="mt-8 h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
            <div className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 w-[200%] animate-[shimmer_2s_linear_infinite]"></div>
        </div>

      </div>
    </div>
  );
};

export default AnalysisLoader;