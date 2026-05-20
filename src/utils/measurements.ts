/**
 * Parse tailor measurement input: decimals, simple fractions (1/4), mixed (36 1/4).
 */
export function parseMeasurementValue(raw: string): number | null {
  const s = raw.trim();
  if (!s) return null;

  const simpleFrac = s.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (simpleFrac) {
    const num = Number(simpleFrac[1]);
    const den = Number(simpleFrac[2]);
    if (den !== 0 && Number.isFinite(num) && Number.isFinite(den)) {
      return num / den;
    }
    return null;
  }

  const mixed = s.match(/^(\d+(?:\.\d+)?)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const whole = Number(mixed[1]);
    const num = Number(mixed[2]);
    const den = Number(mixed[3]);
    if (den !== 0) return whole + num / den;
    return null;
  }

  const n = parseFloat(s);
  return Number.isNaN(n) ? null : n;
}

export type MeasurementValueResult = {
  number?: number;
  text?: string;
};

/** Store numeric when possible; keep literal text for fractions and free-form notes. */
export function coerceMeasurementValue(
  raw: string,
  options?: { textOnly?: boolean }
): MeasurementValueResult {
  const trimmed = raw.trim();
  if (!trimmed) return {};

  if (options?.textOnly) {
    return { text: trimmed };
  }

  if (trimmed.includes("/")) {
    const parsed = parseMeasurementValue(trimmed);
    if (parsed !== null) {
      return { number: parsed, text: trimmed };
    }
    return { text: trimmed };
  }

  const parsed = parseMeasurementValue(trimmed);
  if (parsed !== null) {
    return { number: parsed };
  }

  if (/^[0-9.]+$/.test(trimmed)) {
    return {};
  }

  return { text: trimmed };
}
