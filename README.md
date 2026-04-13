# In-Hand Helper Calculator

A modern salary impact dashboard built with Next.js. It helps visualize how applying a 50% basic salary rule changes your monthly salary structure, deductions, and net in-hand pay.

## What It Does

- Supports monthly and yearly input modes with automatic normalization.
- Compares current vs projected salary structure in real time after calculation.
- Shows component-level impacts for earnings and deductions.
- Supports old and new tax regime toggles.
- Uses Indian currency formatting across all values.
- Includes light/dark theme support.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Shadcn/Base UI components
- Lucide icons

## Project Structure

- `app/page.tsx` - Main salary dashboard UI and interaction logic.
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

## How To Use

1. Choose whether your entered values are monthly or yearly.
2. Enter CTC, gross salary, basic salary, HRA, and optional deductions.
3. Select tax regime (old/new).
4. Click **Calculate** to update projections and comparisons.
5. Review net in-hand impact, detailed breakdown, and key differences.

## Notes

- Results are updated when you press **Calculate**.
- Validation prevents invalid salary combinations (for example, `Basic + HRA > Gross`).

## Deployment

Build and run in production mode:

```bash
npm run build
npm run start
```

You can also deploy on [Vercel](https://vercel.com/new).
