const Input = ({ label, type = "text", ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-hacker-green text-xs font-bold mb-1 uppercase tracking-wider">
        {'>'} {label}
      </label>
      <input
        type={type}
        className="w-full bg-black border border-green-800 text-green-400 px-3 py-2 focus:outline-none focus:border-hacker-green focus:shadow-neon transition-all placeholder-green-900 font-mono"
        autoComplete="off"
        {...props}
      />
    </div>
  );
};

export default Input;