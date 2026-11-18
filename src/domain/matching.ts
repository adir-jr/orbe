import { isOpenForInterest } from "./request-status";
import type { CommercialAccess, ProfessionalStatus, RequestStatus } from "./types";

/**
 * Compatibilidade entre solicitações e profissionais.
 *
 * Regras simples e auditáveis (sem IA): um profissional só vê uma
 * oportunidade quando TODAS as condições abaixo são verdadeiras.
 */

export interface MatchableRequest {
  status: RequestStatus;
  serviceSlug: string;
  citySlug: string;
  neighborhoodSlug: string;
  clientId: string;
}

export interface MatchableProfessional {
  userId: string;
  status: ProfessionalStatus;
  commercialAccess: CommercialAccess;
  serviceSlugs: readonly string[];
  citySlug: string;
  neighborhoodSlugs: readonly string[];
  servesWholeCity: boolean;
}

export type MatchFailureReason =
  | "request_not_open"
  | "professional_not_approved"
  | "no_commercial_access"
  | "service_not_offered"
  | "outside_service_area"
  | "own_request";

export type MatchResult = { eligible: true } | { eligible: false; reason: MatchFailureReason };

const ACCESS_WITH_OPPORTUNITIES: readonly CommercialAccess[] = ["pilot", "trial", "subscriber"];

export function evaluateMatch(
  request: MatchableRequest,
  professional: MatchableProfessional,
): MatchResult {
  if (!isOpenForInterest(request.status)) {
    return { eligible: false, reason: "request_not_open" };
  }
  if (professional.status !== "approved") {
    return { eligible: false, reason: "professional_not_approved" };
  }
  if (!ACCESS_WITH_OPPORTUNITIES.includes(professional.commercialAccess)) {
    return { eligible: false, reason: "no_commercial_access" };
  }
  if (request.clientId === professional.userId) {
    return { eligible: false, reason: "own_request" };
  }
  if (!professional.serviceSlugs.includes(request.serviceSlug)) {
    return { eligible: false, reason: "service_not_offered" };
  }
  const servesArea =
    professional.citySlug === request.citySlug &&
    (professional.servesWholeCity ||
      professional.neighborhoodSlugs.includes(request.neighborhoodSlug));
  if (!servesArea) {
    return { eligible: false, reason: "outside_service_area" };
  }
  return { eligible: true };
}

export function isEligible(
  request: MatchableRequest,
  professional: MatchableProfessional,
): boolean {
  return evaluateMatch(request, professional).eligible;
}
