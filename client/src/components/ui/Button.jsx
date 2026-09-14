const variants = {
  primary:
    "bg-ink text-canvas dark:bg-ink-dark dark:text-canvas-dark hover:opacity-90 border border-transparent",
  secondary:
    "bg-transparent text-ink dark:text-ink-dark border border-line dark:border-line-dark hover:border-ink/40 dark:hover:border-ink-dark/40",
  ghost: "bg-transparent text-ink dark:text-ink-dark hover:bg-surface dark:hover:bg-surface-dark border border-transparent",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
