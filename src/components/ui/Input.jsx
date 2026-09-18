function Input({ label, icon: Icon, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="mb-1 block text-sm font-medium text-ink/70">{label}</label>}
      <div className="relative">
        {Icon && (
          <Icon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        )}
        <input
          className={`w-full rounded-md border border-line bg-stone px-3 py-2 text-ink placeholder:text-ink/40 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss ${Icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-rust">{error}</p>}
    </div>
  );
}

export default Input;
