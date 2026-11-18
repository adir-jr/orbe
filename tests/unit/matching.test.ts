import { describe, expect, it } from "vitest";
import { evaluateMatch, type MatchableProfessional, type MatchableRequest } from "@/domain/matching";

const request: MatchableRequest = {
  status: "published",
  serviceSlug: "eletricista",
  citySlug: "joinville",
  neighborhoodSlug: "america",
  clientId: "client-1",
};

const professional: MatchableProfessional = {
  userId: "pro-1",
  status: "approved",
  commercialAccess: "pilot",
  serviceSlugs: ["eletricista"],
  citySlug: "joinville",
  neighborhoodSlugs: ["america", "centro"],
  servesWholeCity: false,
};

describe("compatibilidade solicitação × profissional", () => {
  it("é elegível quando serviço, região, status e acesso conferem", () => {
    expect(evaluateMatch(request, professional)).toEqual({ eligible: true });
  });

  it.each([
    ["request_not_open", { ...request, status: "closed" as const }, professional],
    ["request_not_open", { ...request, status: "blocked" as const }, professional],
    ["professional_not_approved", request, { ...professional, status: "pending" as const }],
    ["professional_not_approved", request, { ...professional, status: "suspended" as const }],
    ["no_commercial_access", request, { ...professional, commercialAccess: "none" as const }],
    ["service_not_offered", request, { ...professional, serviceSlugs: ["encanador"] }],
    ["outside_service_area", { ...request, neighborhoodSlug: "itaum" }, professional],
    ["outside_service_area", { ...request, citySlug: "blumenau" }, { ...professional, servesWholeCity: true }],
    ["own_request", { ...request, clientId: "pro-1" }, professional],
  ])("rejeita com motivo %s", (reason, req, pro) => {
    expect(evaluateMatch(req, pro)).toEqual({ eligible: false, reason });
  });

  it("quem atende toda a cidade recebe pedidos de qualquer bairro", () => {
    const pro = { ...professional, neighborhoodSlugs: [], servesWholeCity: true };
    expect(evaluateMatch({ ...request, neighborhoodSlug: "pirabeiraba" }, pro).eligible).toBe(true);
  });
});
