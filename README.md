# In-Hand Helper Calculator

A salary planning dashboard built with Next.js. It helps visualize how enforcing a 50% basic salary structure impacts deductions, tax, and net in-hand salary.

## What It Does

- Supports monthly and yearly amount modes with normalization.
- Compares current and projected salary structure after calculation.
- Shows earnings and deduction deltas at component level.
- Compares old vs new tax regime using projected values.
- Adds a dedicated tax-exempt deduction impact comparison when provided.
- Highlights the better regime for quicker decisions.
- Uses Indian currency formatting across the UI.
- Includes light/dark theme support.

## Recent Changes

- Refactored the salary planner into a feature-based structure (`components`, `hooks`, `services`, `types`, `utils`).
- Added `TaxExemptDeductionComparisonCard` for with/without deduction monthly in-hand comparison.
- Added `PrivacyFooter` for clear local-calculation messaging.
- Kept `app/page.tsx` as a thin composition layer wired to `useSalaryPlanner`.
- Added and expanded test coverage for the salary input card and planner hook flow.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Shadcn/Base UI components
- Lucide icons

## Project Structure

The salary planner follows a layered feature structure:

- `app/page.tsx` - Thin orchestration container that composes feature components and hooks.
- `features/salary-planner/components/*` - Focused presentational sections (header, inputs, comparison cards, footer, shared planner styles).
- `features/salary-planner/hooks/useSalaryPlanner.ts` - Stateful orchestration for form inputs, validation, projection flow, and derived comparison data.
- `features/salary-planner/hooks/useCountUp.ts` - Reusable animated number hook for dashboard counters.
- `features/salary-planner/services/salaryPlannerService.ts` - Service abstraction over salary breakdown calculation (dependency-injection friendly for tests).
- `features/salary-planner/utils/currency.ts` - Pure input parsing and currency formatting helpers.
- `features/salary-planner/types.ts` - Shared domain and view-model TypeScript types.
- `lib/tax-calculator.ts` - Core tax and salary breakdown computation.
- `components/ui/*` - Reusable UI building blocks.

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm (or any compatible package manager)

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the local development server.
- `npm run build` - Create a production build.
- `npm run start` - Run the production build.
- `npm run lint` - Run ESLint checks.
- `npm run test` - Run unit tests once with Vitest.
- `npm run test:watch` - Run Vitest in watch mode.

## How To Use

1. Choose whether your entered values are monthly or yearly.
2. Enter CTC, gross salary, basic salary, HRA, and optional deductions.
3. Select tax regime (old/new).
4. Optionally enter a tax-exempt deduction amount.
5. Click **Calculate** to update projections and comparisons.
6. Review net in-hand impact, tax regime comparison, tax-exempt comparison (if applicable), detailed breakdown, and key differences.

## Notes

- Results are updated when you press **Calculate**.
- Validation prevents invalid salary combinations (for example, `Basic + HRA > Gross`).
- Tax-exempt comparison appears only when a tax-exempt deduction value is provided.
- All calculations run locally in the browser.

## Testing

- Test runner: **Vitest** with **jsdom** environment.
- Component tests use **React Testing Library** + `@testing-library/jest-dom`.
- Example tests:
  - `features/salary-planner/components/SalaryInputCard.test.tsx`
  - `features/salary-planner/hooks/useSalaryPlanner.test.ts`

## Deployment

Build and run in production mode:

```bash
npm run build
npm run start
```

You can also deploy on [Vercel](https://vercel.com/new).
