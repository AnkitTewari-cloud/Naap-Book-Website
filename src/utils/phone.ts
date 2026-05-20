export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
  if (raw.startsWith("+")) return `+${digits}`;
  return digits ? `+${digits}` : "";
}

export function formatIndianPhone(raw: string): string {
  if (!raw) return "";
  const norm = normalizePhone(raw);
  if (norm.startsWith("+91") && norm.length === 13) {
    return `${norm.slice(0, 3)} ${norm.slice(3, 8)} ${norm.slice(8)}`;
  }
  return norm;
}

export function getWaShareLink(phone: string, text: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  const number = digits.startsWith("91") ? digits : `91${digits.slice(-10)}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function getCallLink(phone: string): string {
  return `tel:${normalizePhone(phone)}`;
}

export function getSmsLink(phone: string, body?: string): string {
  const tel = normalizePhone(phone);
  const base = `sms:${tel}`;
  return body ? `${base}?body=${encodeURIComponent(body)}` : base;
}
