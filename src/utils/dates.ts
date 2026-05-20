export function toDate(value: string | Date | undefined | null): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

const MONTHS_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS_HI = [
  "जन", "फर", "मार्च", "अप्रै", "मई", "जून",
  "जुला", "अग", "सित", "अक्टू", "नव", "दिस",
];

const MONTHS_KN = [
  "ಜನ", "ಫೆಬ್", "ಮಾರ್", "ಏಪ್ರಿ", "ಮೇ", "ಜೂನ್",
  "ಜುಲೈ", "ಆಗ", "ಸೆಪ್", "ಅಕ್ಟೋ", "ನವೆ", "ಡಿಸೆ",
];

export function formatDate(
  value: string | Date | undefined | null,
  opts: { language?: string; withTime?: boolean } = {}
): string {
  const d = toDate(value);
  if (!d) return "";
  const months =
    opts.language === "hi"
      ? MONTHS_HI
      : opts.language === "kn"
        ? MONTHS_KN
        : MONTHS_EN;
  const day = d.getDate();
  const mon = months[d.getMonth()] ?? "";
  const year = d.getFullYear();
  let out = `${day} ${mon} ${year}`;
  if (opts.withTime) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    out += `, ${hh}:${mm}`;
  }
  return out;
}

export function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

export function endOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(23, 59, 59, 999);
  return out;
}

export function daysBetween(
  a: string | Date,
  b: string | Date
): number {
  const da = toDate(a);
  const db = toDate(b);
  if (!da || !db) return 0;
  const ms = startOfDay(db).getTime() - startOfDay(da).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function isToday(value: string | Date | undefined | null): boolean {
  const d = toDate(value);
  if (!d) return false;
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

export function isOverdue(value: string | Date | undefined | null): boolean {
  const d = toDate(value);
  if (!d) return false;
  return d.getTime() < startOfDay(new Date()).getTime();
}

export function isoDateOnly(value: string | Date): string {
  const d = toDate(value) ?? new Date();
  return d.toISOString().slice(0, 10);
}

export function addDays(value: string | Date, days: number): Date {
  const d = toDate(value) ?? new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function monthGrid(
  year: number,
  monthZeroIndexed: number,
  weekStartsOn: "sun" | "mon" = "mon"
): Date[][] {
  const first = new Date(year, monthZeroIndexed, 1);
  let firstWeekday = first.getDay();
  if (weekStartsOn === "mon") {
    firstWeekday = (firstWeekday + 6) % 7;
  }
  const daysInMonth = new Date(year, monthZeroIndexed + 1, 0).getDate();
  const cells: Date[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(new Date(year, monthZeroIndexed, i - firstWeekday + 1));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, monthZeroIndexed, d));
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1]!;
    cells.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
  }
  const weeks: Date[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}
