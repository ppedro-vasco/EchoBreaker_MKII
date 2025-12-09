import { Loader2 } from 'lucide-react';

const Button = ({ children, loading, ...props }) => {
  return (
    <button
      className={`
        w-full bg-transparent border border-hacker-green text-hacker-green 
        font-bold py-2 px-4 uppercase tracking-widest hover:bg-hacker-green hover:text-black 
        transition-all duration-300 flex items-center justify-center gap-2
        ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-neon'}
      `}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="animate-spin w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;