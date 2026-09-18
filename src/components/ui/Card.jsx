function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-md border border-line bg-mist p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
