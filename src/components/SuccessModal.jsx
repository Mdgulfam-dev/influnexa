export default function SuccessModal({ open, title, message, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/65 p-4 backdrop-blur-sm" role="presentation">
      <section className="relative w-full max-w-md rounded-[2rem] bg-white p-7 text-center shadow-2xl shadow-slate-950/30 dark:bg-slate-900" role="dialog" aria-modal="true" aria-labelledby="success-modal-title">
        <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-white/10 dark:hover:text-white" type="button" onClick={onClose} aria-label="Close success message">
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </button>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300">
          <svg className="h-9 w-9" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m5 12.5 4.2 4.2L19.5 6.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </div>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">Submission received</p>
        <h2 id="success-modal-title" className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{message}</p>
        <button className="mt-7 w-full rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700" type="button" onClick={onClose}>
          OK
        </button>
      </section>
    </div>
  );
}
