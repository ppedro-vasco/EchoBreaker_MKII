const Input = ({ label, type = "text", ...props }) => {
  return (
    <div className="mb-5 group">
      <label className="block text-aero-blue text-sm font-display font-bold mb-2 uppercase tracking-widest opacity-80 group-focus-within:opacity-100 transition-opacity">
        {label}
      </label>
      <input
        type={type}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white 
        placeholder-white/30 focus:outline-none focus:border-aero-blue/50 focus:bg-black/40 
        focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all duration-300"
        autoComplete="off"
        {...props}
      />
    </div>
  );
};

export default Input;