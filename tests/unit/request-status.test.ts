import { describe, expect, it } from "vitest";
import {
  allowedTransitions,
  assertTransition,
  canTransition,
  InvalidTransitionError,
  isFinalStatus,
  isOpenForInterest,
} from "@/domain/request-status";
import { REQUEST_STATUSES } from "@/domain/types";

describe("máquina de estados da solicitação", () => {
  it("permite o fluxo feliz do cliente", () => {
    expect(canTransition("draft", "published", "client")).toBe(true);
    expect(canTransition("published", "in_negotiation", "client")).toBe(true);
    expect(canTransition("in_negotiation", "closed", "client")).toBe(true);
  });

  it("permite cancelar a partir de qualquer estado não final", () => {
    for (const from of ["draft", "published", "in_negotiation", "blocked"] as const) {
      expect(canTransition(from, "cancelled", "client")).toBe(true);
    }
  });

  it("estados finais não têm saída", () => {
    expect(isFinalStatus("closed")).toBe(true);
    expect(isFinalStatus("cancelled")).toBe(true);
    for (const to of REQUEST_STATUSES) {
      expect(canTransition("closed", to, "admin")).toBe(false);
      expect(canTransition("cancelled", to, "admin")).toBe(false);
    }
  });

  it("somente a moderação bloqueia e desbloqueia", () => {
    expect(canTransition("published", "blocked", "client")).toBe(false);
    expect(canTransition("published", "blocked", "admin")).toBe(true);
    expect(canTransition("blocked", "published", "client")).toBe(false);
    expect(canTransition("blocked", "published", "admin")).toBe(true);
  });

  it("não permite pular etapas nem voltar a rascunho", () => {
    expect(canTransition("draft", "closed", "client")).toBe(false);
    expect(canTransition("draft", "in_negotiation", "client")).toBe(false);
    expect(canTransition("published", "draft", "client")).toBe(false);
  });

  it("assertTransition lança erro em transições inválidas", () => {
    expect(() => assertTransition("closed", "published", "client")).toThrow(InvalidTransitionError);
    expect(() => assertTransition("draft", "published", "client")).not.toThrow();
  });

  it("toda transição declarada aponta para um estado válido", () => {
    for (const from of REQUEST_STATUSES) {
      for (const to of allowedTransitions(from)) {
        expect(REQUEST_STATUSES).toContain(to);
      }
    }
  });

  it("apenas solicitações publicadas ou em negociação aceitam interesse", () => {
    expect(REQUEST_STATUSES.filter(isOpenForInterest)).toEqual(["published", "in_negotiation"]);
  });
});
