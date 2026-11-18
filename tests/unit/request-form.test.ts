import { describe, expect, it } from "vitest";
import { services } from "@/data/catalog";
import { EMPTY_REQUEST_FORM, fullRequestSchema, validateStep, type RequestFormValues } from "@/domain/request-form";

const electrician = services.find((s) => s.slug === "eletricista")!;

const valid: RequestFormValues = {
  ...EMPTY_REQUEST_FORM,
  serviceSlug: "eletricista",
  description: "Preciso instalar três tomadas novas na sala de casa.",
  answers: { scope: "installation" },
  neighborhoodSlug: "america",
  urgency: "this_week",
  preferredPeriod: "morning",
  contactConsent: true,
};

describe("validação do formulário de solicitação", () => {
  it("aceita um formulário completo", () => {
    for (const step of ["service", "details", "location", "review"] as const) {
      expect(validateStep(step, valid, electrician.questions)).toEqual({});
    }
    expect(fullRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("exige a escolha do serviço", () => {
    expect(validateStep("service", EMPTY_REQUEST_FORM)).toHaveProperty("serviceSlug");
  });

  it("exige descrição mínima e perguntas obrigatórias", () => {
    const errors = validateStep("details", { ...valid, description: "curta", answers: {} }, electrician.questions);
    expect(errors.description).toMatch(/pelo menos/);
    expect(errors["answers.scope"]).toBeDefined();
    // "property" é opcional
    expect(errors["answers.property"]).toBeUndefined();
  });

  it("rejeita respostas que não estão entre as opções", () => {
    const errors = validateStep("details", { ...valid, answers: { scope: "hack" } }, electrician.questions);
    expect(errors["answers.scope"]).toBeDefined();
  });

  it("valida local, prazo e orçamento", () => {
    const errors = validateStep("location", { ...valid, neighborhoodSlug: "", urgency: "", budget: "abc" });
    expect(Object.keys(errors).sort()).toEqual(["budget", "neighborhoodSlug", "urgency"]);
    expect(validateStep("location", { ...valid, budget: "250,00" })).toEqual({});
    expect(validateStep("location", { ...valid, citySlug: "blumenau" })).toHaveProperty("citySlug");
  });

  it("exige consentimento explícito para publicar", () => {
    expect(validateStep("review", { ...valid, contactConsent: false })).toHaveProperty("contactConsent");
  });
});
