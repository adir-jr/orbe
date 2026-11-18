/**
 * Tipos de domínio do ORBE Serviços.
 *
 * Estes tipos descrevem o negócio, independentemente de onde os dados estão
 * armazenados (dados locais na Fase 1, Supabase/PostgreSQL a partir da Fase 2).
 */

export type IconKey =
  | "home"
  | "sparkles"
  | "wrench"
  | "hammer"
  | "briefcase"
  | "zap"
  | "droplet"
  | "paintbrush"
  | "brick"
  | "sofa"
  | "tool"
  | "broom"
  | "building"
  | "leaf"
  | "snowflake"
  | "washing"
  | "wifi"
  | "camera"
  | "flame"
  | "fence"
  | "ruler"
  | "window"
  | "aperture"
  | "pen"
  | "monitor"
  | "car";

/** Pergunta contextual exibida no formulário de solicitação de um serviço. */
export interface ServiceQuestion {
  id: string;
  label: string;
  type: "single_choice";
  options: { value: string; label: string }[];
  required: boolean;
}

export interface Service {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  /** Frase curta usada em cards e páginas de serviço. */
  summary: string;
  /** Termos alternativos usados pela busca (ex.: "eletricista" → "tomada"). */
  keywords: string[];
  icon: IconKey;
  /** Perguntas específicas. Serviços sem perguntas usam apenas o formulário base. */
  questions: ServiceQuestion[];
  /** Indica se o serviço faz parte do lançamento piloto. */
  isActive: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: IconKey;
  sortOrder: number;
  isActive: boolean;
}

export interface CategoryWithServices extends Category {
  services: Service[];
}

export interface Neighborhood {
  slug: string;
  name: string;
  citySlug: string;
}

export interface City {
  slug: string;
  name: string;
  state: string;
}

// ---------------------------------------------------------------------------
// Solicitações
// ---------------------------------------------------------------------------

export const REQUEST_STATUSES = [
  "draft",
  "published",
  "in_negotiation",
  "closed",
  "cancelled",
  "blocked",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const URGENCY_OPTIONS = [
  { value: "urgent", label: "Urgente (até 24 horas)" },
  { value: "this_week", label: "Nos próximos dias" },
  { value: "this_month", label: "Neste mês" },
  { value: "flexible", label: "Sem pressa / a combinar" },
] as const;

export type Urgency = (typeof URGENCY_OPTIONS)[number]["value"];

export const PERIOD_OPTIONS = [
  { value: "morning", label: "Manhã" },
  { value: "afternoon", label: "Tarde" },
  { value: "evening", label: "Noite" },
  { value: "any", label: "Qualquer período" },
] as const;

export type PreferredPeriod = (typeof PERIOD_OPTIONS)[number]["value"];

// ---------------------------------------------------------------------------
// Profissionais
// ---------------------------------------------------------------------------

export const PROFESSIONAL_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "suspended",
] as const;

export type ProfessionalStatus = (typeof PROFESSIONAL_STATUSES)[number];

/**
 * Elegibilidade comercial. Na fase piloto, a administração concede acesso
 * manualmente ("pilot"). A assinatura paga ("subscriber") só existirá na Fase 4.
 */
export type CommercialAccess = "none" | "pilot" | "trial" | "subscriber";

export interface ProfessionalSummary {
  id: string;
  slug: string;
  displayName: string;
  headline: string;
  about: string;
  citySlug: string;
  serviceSlugs: string[];
  neighborhoodSlugs: string[];
  /** Atende toda a cidade, além dos bairros listados. */
  servesWholeCity: boolean;
  yearsOfExperience?: number;
  availability: string;
  status: ProfessionalStatus;
  /** Dados exibidos na Fase 1 são fictícios e precisam ser sinalizados. */
  isDemo: boolean;
}
