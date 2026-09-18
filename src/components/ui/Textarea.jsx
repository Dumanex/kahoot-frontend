function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="mb-1 block text-sm font-medium text-ink/70">{label}</label>}
      <textarea
        className="w-full rounded-md border border-line bg-stone px-3 py-2 text-ink placeholder:text-ink/40 focus:outline-none focus:border-moss focus:ring-1 focus:ring-moss"
        {...props}
      />
      {error && <p className="mt-1 text-sm text-rust">{error}</p>}
    </div>
  );
}

export default Textarea;
