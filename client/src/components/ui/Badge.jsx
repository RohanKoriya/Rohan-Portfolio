export default function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-line dark:border-line-dark bg-surface/60 dark:bg-surface-dark/60 px-3 py-1 text-xs text-muted dark:text-muted-dark ${className}`}
    >
      {children}
    </span>
  );
}
