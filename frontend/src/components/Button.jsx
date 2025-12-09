import { Loader2 } from 'lucide-react';

const Button = ({ children, loading, onClick, variant = 'primary', ...props }) => {
  const baseStyles = "w-full font-display font-bold py-3 px-6 rounded-xl uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-glow border border-transparent hover:scale-[1.02]",
    secondary: "bg-white/5 border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${loading ? 'opacity-70 cursor-wait' : ''}`}
      disabled={loading}
      {...props}
    >
      {/* Brilho Glossy no topo */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50"></div>
      
      {loading && <Loader2 className="animate-spin w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;