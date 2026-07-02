export default function Button({ children, variant = "primary", href = "#contact", className = "" }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300/25";

  const styles = {
    primary:
      "premium-button text-white hover:-translate-y-0.5",
    secondary:
      "border border-slate-300/70 bg-white/80 text-slate-950 shadow-lg shadow-slate-900/5 backdrop-blur hover:-translate-y-0.5 hover:border-slate-400 hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/16",
    dark: "border border-white/20 bg-white/12 text-white shadow-xl shadow-black/10 backdrop-blur hover:-translate-y-0.5 hover:bg-white/18",
  };

  return (
    <a className={`${base} ${styles[variant]} ${className}`} href={href}>
      <span>{children}</span>
      {variant === "primary" && (
        <svg className="button-arrow" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 10h9M10.5 5.5 15 10l-4.5 4.5" />
        </svg>
      )}
    </a>
  );
}
