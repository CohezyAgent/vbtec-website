// SINGLE SWAP POINT for lead delivery (03 §6.1).
// Today it only logs the validated lead on the server. Replace the body of `submitLead`
// with the real integration (CRM, e-mail, webhook…) – nothing else needs to change.
// Server-only: imported by the Server Action in src/app/actions/lead.ts.

import type { LeadValues } from "./lead-schema";

export type ValidatedLead = Omit<LeadValues, "verbruikWaarde"> & {
  verbruikWaarde: number | null;
};

export async function submitLead(lead: ValidatedLead): Promise<{ ok: true }> {
  // Timestamp only here (never in render).
  const receivedAt = new Date().toISOString();
  console.log("[lead] nieuwe aanvraag", JSON.stringify({ receivedAt, ...lead }, null, 2));
  return { ok: true };
}

/** Analytics hooks (03 §6.8) – intentionally no-ops in v1. */
export function trackLeadEvent(_event: "lead_step1_complete" | "lead_submit_success" | "lead_submit_error"): void {
  void _event;
}
