const TONE_CLASSES = {
  moss: 'bg-moss-soft text-moss',
  rust: 'bg-rust-soft text-rust',
  neutral: 'bg-mist text-ink/70 border border-line',
};

function Badge({ tone = 'neutral', icon: Icon, className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]} ${className}`}
    >
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
}

export default Badge;
