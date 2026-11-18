import { describe, expect, it } from "vitest";
import {
  canExpressInterest,
  canGrantContact,
  MAX_CONTACT_GRANTS_PER_REQUEST,
  MAX_INTERESTS_PER_REQUEST,
  type ContactGrantContext,
} from "@/domain/contact-policy";

const base: ContactGrantContext = {
  requestStatus: "published",
  clientConsented: true,
  professionalHasInterest: true,
  activeGrantsForRequest: 0,
  professionalAlreadyGranted: false,
};

describe("liberação de contato", () => {
  it("libera quando há consentimento, interesse e limite disponível", () => {
    expect(canGrantContact(base)).toEqual({ allowed: true });
  });

  it("exige consentimento explícito do cliente", () => {
    expect(canGrantContact({ ...base, clientConsented: false })).toEqual({
      allowed: false,
      reason: "missing_consent",
    });
  });

  it("exige interesse prévio do profissional", () => {
    expect(canGrantContact({ ...base, professionalHasInterest: false })).toMatchObject({ reason: "no_interest" });
  });

  it("respeita o limite de profissionais por solicitação", () => {
    expect(
      canGrantContact({ ...base, activeGrantsForRequest: MAX_CONTACT_GRANTS_PER_REQUEST }),
    ).toMatchObject({ reason: "limit_reached" });
    expect(canGrantContact({ ...base, activeGrantsForRequest: MAX_CONTACT_GRANTS_PER_REQUEST - 1 }).allowed).toBe(
      true,
    );
  });

  it("não duplica concessões nem libera em solicitações encerradas", () => {
    expect(canGrantContact({ ...base, professionalAlreadyGranted: true })).toMatchObject({
      reason: "already_granted",
    });
    expect(canGrantContact({ ...base, requestStatus: "closed" })).toMatchObject({ reason: "request_not_open" });
  });
});

describe("manifestação de interesse", () => {
  it("bloqueia após atingir o limite ou se já houver interesse", () => {
    const ok = { requestStatus: "published" as const, currentInterests: 0, alreadyInterested: false };
    expect(canExpressInterest(ok)).toBe(true);
    expect(canExpressInterest({ ...ok, currentInterests: MAX_INTERESTS_PER_REQUEST })).toBe(false);
    expect(canExpressInterest({ ...ok, alreadyInterested: true })).toBe(false);
    expect(canExpressInterest({ ...ok, requestStatus: "cancelled" })).toBe(false);
  });
});
