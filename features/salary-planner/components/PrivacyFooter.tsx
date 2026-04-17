export function PrivacyFooter() {
  return (
    <footer className="rounded-3xl border border-zinc-200/70 bg-white/85 px-5 py-4 text-sm shadow-[0_18px_40px_-34px_rgba(30,41,59,0.7)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/75">
      <p className="text-xs font-semibold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
        Privacy Commitment
      </p>
      <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
        We do not store, retain, or share any salary information entered in this calculator.
      </p>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">
        This tool is designed with a privacy-first approach for sensitive salary planning use
        cases.
      </p>
      <a
        href="https://github.com/kdjadeja21/in-hand-helper-calculator"
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex text-sm font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
      >
        View source code on GitHub
      </a>
      <div className="mt-3 border-t border-zinc-200/80 dark:border-zinc-800" />
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Planning your long-term investments too? Use our SIP calculator for quick projections.
      </p>
      <a
        href="https://sip-calc.vercel.app/"
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-flex text-sm font-medium text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
      >
        Try SIP calculator
      </a>
    </footer>
  );
}
