// Hand-off between the floating mini form (FloatingLead) and the full LeadForm.
// Only the first answer (woningtype) travels – no personal data, never via the URL. It also
// sits in sessionStorage so it survives a jump to /contact#berekening on pages without a form.

export type LeadPrefill = { woningtype: string };

const KEY = "vbtec-lead-prefill";
const listeners = new Set<(p: LeadPrefill) => void>();

export function sendPrefill(p: LeadPrefill): boolean {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage blocked – the in-page hand-off below still works */
  }
  listeners.forEach((l) => l(p));
  return listeners.size > 0;
}

/** Takes (and clears) a prefill left by a previous page. */
export function takePrefill(): LeadPrefill | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const p = JSON.parse(raw) as Partial<LeadPrefill>;
    return typeof p.woningtype === "string" ? { woningtype: p.woningtype } : null;
  } catch {
    return null;
  }
}

export function subscribePrefill(l: (p: LeadPrefill) => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** Clears the stored copy once a form has applied it. */
export function clearPrefill(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
