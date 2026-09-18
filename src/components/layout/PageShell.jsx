function PageShell({ children, center = false, className = '' }) {
  return (
    <div className={`min-h-screen bg-stone ${center ? 'flex flex-col items-center justify-center' : ''}`}>
      <div className={`mx-auto w-full max-w-5xl px-6 py-10 ${center ? 'flex flex-col items-center' : ''} ${className}`}>{children}</div>
    </div>
  );
}

export default PageShell;
