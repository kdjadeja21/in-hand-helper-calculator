export function parseAmount(value: string): number {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatInputINR(value: string): string {
  if (!value) return "";
  const numeric = Number(value.replace(/[^\d]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return "";
  return new Intl.NumberFormat("en-IN").format(numeric);
}

export function extractDigits(value: string): string {
  return value.replace(/[^\d]/g, "");
}
