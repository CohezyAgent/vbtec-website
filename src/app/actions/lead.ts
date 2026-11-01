"use server";

// Server Action behind <LeadForm /> (useActionState). Server-side validation is the
// source of truth; delivery happens in submitLead (src/lib/lead.ts, the swap point).

import { submitLead } from "@/lib/lead";
import {
  firstName,
  leadFromFormData,
  serverErrorMessage,
  validateLead,
  type LeadState,
} from "@/lib/lead-schema";

let submissionCounter = 0;

export async function submitLeadAction(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const values = leadFromFormData(formData);

  // Honeypot: bots fill the hidden "website" field → pretend success, log nothing.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { status: "success", firstName: firstName(values.naam) };
  }

  const fieldErrors = validateLead(values);
  if (Object.keys(fieldErrors).length > 0) {
    submissionCounter += 1;
    return { status: "error", fieldErrors, values, submissionId: submissionCounter };
  }

  try {
    const raw = values.verbruikWaarde.trim().replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
    await submitLead({
      ...values,
      naam: values.naam.trim(),
      email: values.email.trim(),
      telefoon: values.telefoon.trim(),
      postcode: values.postcode.trim(),
      opmerking: values.opmerking.trim(),
      verbruikWaarde: values.verbruikOnbekend || !raw ? null : Number(raw),
    });
  } catch {
    submissionCounter += 1;
    return { status: "error", fieldErrors: {}, values, formError: serverErrorMessage(), submissionId: submissionCounter };
  }

  return { status: "success", firstName: firstName(values.naam) };
}
