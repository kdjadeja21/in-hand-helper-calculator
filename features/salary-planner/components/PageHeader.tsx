import { Calculator } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function PageHeader() {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/85 p-6 shadow-[0_24px_50px_-34px_rgba(30,41,59,0.65)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/75 sm:p-8">
      <div className="absolute -top-28 right-8 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/25" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] text-blue-700 uppercase dark:border-blue-700/50 dark:bg-blue-950/50 dark:text-blue-300">
            <Calculator className="size-3.5" aria-hidden />
            Salary Planner
          </div>
          <ThemeToggle />
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Salary Impact Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
          Visualize how enforcing a 50% basic salary rule impacts your pay structure, deductions,
          and monthly in-hand salary.
        </p>
      </div>
    </header>
  );
}
