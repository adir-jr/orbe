import { isOpenForInterest } from "./request-status";
import type { RequestStatus } from "./types";

/**
 * Política de liberação de contatos (proposta para a Fase 2).
 *
 * Fluxo:
 * 1. O profissional elegível clica em "Tenho interesse" → cria um request_interest.
 *    Nenhum dado de contato é liberado neste momento.
 * 2. O cliente vê os profissionais interessados (perfil público) e escolhe
 *    para quem quer liberar o contato → cria um contact_grant individual.
 * 3. Somente com um contact_grant ativo o profissional consegue ler o
 *    telefone do cliente, e cada leitura é registrada em audit_events.
 *
 * Limites protegem o cliente contra abordagens em massa e evitam que a
 * oportunidade perca valor para os profissionais.
 */

/** Máximo de profissionais que podem manifestar interesse em uma solicitação. */
export const MAX_INTERESTS_PER_REQUEST = 5;

/** Máximo de profissionais que podem receber o contato de uma mesma solicitação. */
export const MAX_CONTACT_GRANTS_PER_REQUEST = 3;

export interface ContactGrantContext {
  requestStatus: RequestStatus;
  /** O cliente marcou o consentimento explícito de compartilhamento. */
  clientConsented: boolean;
  /** O profissional manifestou interesse previamente. */
  professionalHasInterest: boolean;
  /** Concessões ativas (não revogadas) já existentes para a solicitação. */
  activeGrantsForRequest: number;
  /** O profissional já possui concessão ativa para esta solicitação. */
  professionalAlreadyGranted: boolean;
}

export type GrantDecision =
  | { allowed: true }
  | {
      allowed: false;
      reason:
        | "request_not_open"
        | "missing_consent"
        | "no_interest"
        | "limit_reached"
        | "already_granted";
    };

export function canGrantContact(ctx: ContactGrantContext): GrantDecision {
  if (!isOpenForInterest(ctx.requestStatus)) return { allowed: false, reason: "request_not_open" };
  if (!ctx.clientConsented) return { allowed: false, reason: "missing_consent" };
  if (!ctx.professionalHasInterest) return { allowed: false, reason: "no_interest" };
  if (ctx.professionalAlreadyGranted) return { allowed: false, reason: "already_granted" };
  if (ctx.activeGrantsForRequest >= MAX_CONTACT_GRANTS_PER_REQUEST) {
    return { allowed: false, reason: "limit_reached" };
  }
  return { allowed: true };
}

export function canExpressInterest(params: {
  requestStatus: RequestStatus;
  currentInterests: number;
  alreadyInterested: boolean;
}): boolean {
  return (
    isOpenForInterest(params.requestStatus) &&
    !params.alreadyInterested &&
    params.currentInterests < MAX_INTERESTS_PER_REQUEST
  );
}
