import { z } from "zod";
import { PERIOD_OPTIONS, URGENCY_OPTIONS, type ServiceQuestion } from "./types";

/**
 * Validação do formulário de solicitação, dividida por etapa.
 * O mesmo schema será reutilizado no servidor (Server Action) na Fase 2:
 * a validação no navegador é conveniência, a do servidor é a garantia.
 */

export const DESCRIPTION_MIN = 20;
export const DESCRIPTION_MAX = 1000;

const urgencyValues = URGENCY_OPTIONS.map((o) => o.value) as [string, ...string[]];
const periodValues = PERIOD_OPTIONS.map((o) => o.value) as [string, ...string[]];

export const serviceStepSchema = z.object({
  serviceSlug: z.string().min(1, "Escolha o serviço de que você precisa."),
});

export const detailsStepSchema = z.object({
  description: z
    .string()
    .trim()
    .min(DESCRIPTION_MIN, `Descreva com pelo menos ${DESCRIPTION_MIN} caracteres.`)
    .max(DESCRIPTION_MAX, `Use no máximo ${DESCRIPTION_MAX} caracteres.`),
  answers: z.record(z.string(), z.string()),
});

export const locationStepSchema = z.object({
  citySlug: z.literal("joinville", "No momento, atendemos apenas Joinville."),
  neighborhoodSlug: z.string().min(1, "Selecione o bairro do atendimento."),
  urgency: z.enum(urgencyValues, "Informe o prazo desejado."),
  preferredPeriod: z.enum(periodValues, "Informe o período de preferência."),
  budget: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{1,7}([.,]\d{1,2})?$/.test(v), "Informe um valor válido, ex.: 250 ou 250,00.")
    .optional(),
});

export const reviewStepSchema = z.object({
  contactConsent: z.literal(true, "É preciso autorizar o compartilhamento para publicar."),
});

export const fullRequestSchema = serviceStepSchema
  .extend(detailsStepSchema.shape)
  .extend(locationStepSchema.shape)
  .extend(reviewStepSchema.shape);

export type RequestFormValues = {
  serviceSlug: string;
  description: string;
  answers: Record<string, string>;
  citySlug: string;
  neighborhoodSlug: string;
  urgency: string;
  preferredPeriod: string;
  budget: string;
  contactConsent: boolean;
};

export const EMPTY_REQUEST_FORM: RequestFormValues = {
  serviceSlug: "",
  description: "",
  answers: {},
  citySlug: "joinville",
  neighborhoodSlug: "",
  urgency: "",
  preferredPeriod: "",
  budget: "",
  contactConsent: false,
};

export const REQUEST_STEPS = [
  { id: "service", title: "Serviço", description: "O que você precisa?" },
  { id: "details", title: "Detalhes", description: "Conte um pouco mais" },
  { id: "location", title: "Local e prazo", description: "Onde e quando" },
  { id: "review", title: "Revisão", description: "Confira e autorize" },
] as const;

export type RequestStepId = (typeof REQUEST_STEPS)[number]["id"];

export type FieldErrors = Partial<Record<string, string>>;

function collectErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

/**
 * Valida uma etapa. As perguntas contextuais obrigatórias do serviço
 * são verificadas junto com a etapa de detalhes.
 */
export function validateStep(
  step: RequestStepId,
  values: RequestFormValues,
  questions: readonly ServiceQuestion[] = [],
): FieldErrors {
  const schema = {
    service: serviceStepSchema,
    details: detailsStepSchema,
    location: locationStepSchema,
    review: reviewStepSchema,
  }[step];

  const result = schema.safeParse(values);
  const errors = result.success ? {} : collectErrors(result.error);

  if (step === "details") {
    for (const q of questions) {
      const answer = values.answers[q.id];
      const validOption = q.options.some((o) => o.value === answer);
      if (q.required && !validOption) {
        errors[`answers.${q.id}`] = "Selecione uma opção.";
      }
    }
  }

  return errors;
}
