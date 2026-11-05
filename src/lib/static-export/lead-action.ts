// Stand-in for the lead Server Action in the GitHub Pages static export (aliased in
// next.config.ts). Pages has no server, so this validates with the same rules and shows the
// success screen without sending anything – a demo build only.
import { firstName, leadFromFormData, validateLead, type LeadState } from "@/lib/lead-schema";

let submissionCounter = 0;

export async function submitLeadAction(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const values = leadFromFormData(formData);
  const fieldErrors = validateLead(values);
  if (Object.keys(fieldErrors).length > 0) {
    submissionCounter += 1;
    return { status: "error", fieldErrors, values, submissionId: submissionCounter };
  }
  return { status: "success", firstName: firstName(values.naam) };
}
