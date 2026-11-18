import type { RequestStatus } from "./types";

/**
 * Máquina de estados de uma solicitação de serviço.
 *
 *   draft ──► published ──► in_negotiation ──► closed
 *     │           │  ▲             │
 *     │           │  └─────────────┘ (cliente volta a receber interesse)
 *     ▼           ▼                ▼
 *  cancelled   cancelled        cancelled
 *
 *   published / in_negotiation ──► blocked (moderação)
 *   blocked ──► published (moderação libera) | cancelled
 *
 * Estados finais: closed, cancelled.
 *
 * A mesma regra será aplicada no banco (trigger) na Fase 2, para que a
 * validação não dependa apenas do frontend.
 */
const TRANSITIONS: Record<RequestStatus, readonly RequestStatus[]> = {
  draft: ["published", "cancelled"],
  published: ["in_negotiation", "closed", "cancelled", "blocked"],
  in_negotiation: ["published", "closed", "cancelled", "blocked"],
  closed: [],
  cancelled: [],
  blocked: ["published", "cancelled"],
};

/** Quem pode disparar cada transição. */
export type Actor = "client" | "admin" | "system";

const ADMIN_ONLY_TARGETS: readonly RequestStatus[] = ["blocked"];
const ADMIN_ONLY_SOURCES: readonly RequestStatus[] = ["blocked"];

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  draft: "Rascunho",
  published: "Publicada",
  in_negotiation: "Em negociação",
  closed: "Encerrada",
  cancelled: "Cancelada",
  blocked: "Bloqueada pela moderação",
};

export function allowedTransitions(from: RequestStatus): readonly RequestStatus[] {
  return TRANSITIONS[from];
}

export function isFinalStatus(status: RequestStatus): boolean {
  return TRANSITIONS[status].length === 0;
}

export function canTransition(
  from: RequestStatus,
  to: RequestStatus,
  actor: Actor,
): boolean {
  if (!TRANSITIONS[from].includes(to)) return false;

  // Bloquear e desbloquear solicitações é exclusivo da moderação.
  if (ADMIN_ONLY_TARGETS.includes(to) || ADMIN_ONLY_SOURCES.includes(from)) {
    // Exceção: o cliente pode cancelar uma solicitação bloqueada.
    if (from === "blocked" && to === "cancelled" && actor === "client") return true;
    return actor === "admin";
  }

  return true;
}

export class InvalidTransitionError extends Error {
  constructor(from: RequestStatus, to: RequestStatus, actor: Actor) {
    super(`Transição não permitida: ${from} → ${to} (por ${actor}).`);
    this.name = "InvalidTransitionError";
  }
}

export function assertTransition(
  from: RequestStatus,
  to: RequestStatus,
  actor: Actor,
): void {
  if (!canTransition(from, to, actor)) {
    throw new InvalidTransitionError(from, to, actor);
  }
}

/** Solicitações que podem ser exibidas como oportunidade para profissionais. */
export function isOpenForInterest(status: RequestStatus): boolean {
  return status === "published" || status === "in_negotiation";
}
