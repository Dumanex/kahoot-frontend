import { Link } from 'react-router-dom';

const VARIANT_CLASSES = {
  primary: 'bg-moss text-stone hover:bg-moss/90',
  secondary: 'bg-mist text-ink border border-line hover:bg-line/50',
  ghost: 'text-ink hover:bg-mist',
  danger: 'bg-rust-soft text-rust border border-rust/30 hover:bg-rust-soft/70',
};

const SIZE_CLASSES = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

function Button({ variant = 'primary', size = 'md', icon: Icon, to, className = '', children, ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {Icon && <Icon size={18} />}
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}

export default Button;
