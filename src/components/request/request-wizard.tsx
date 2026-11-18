"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, FlaskConical, Lock, Pencil } from "lucide-react";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  EMPTY_REQUEST_FORM,
  REQUEST_STEPS,
  validateStep,
  type FieldErrors,
  type RequestFormValues,
} from "@/domain/request-form";
import { MAX_CONTACT_GRANTS_PER_REQUEST } from "@/domain/contact-policy";
import { PERIOD_OPTIONS, URGENCY_OPTIONS, type CategoryWithServices, type Neighborhood } from "@/domain/types";
import { ServiceIcon } from "@/components/catalog/service-icon";
import { Alert } from "@/components/ui/alert";
import { Button, ButtonLink } from "@/components/ui/button";
import { ChoiceGroup } from "@/components/ui/choice";
import { Dialog } from "@/components/ui/dialog";
import { Field, FieldError, Input, Select, Textarea } from "@/components/ui/form-controls";
import { cn } from "@/lib/utils";
import { Stepper } from "./stepper";

interface Props {
  categories: CategoryWithServices[];
  neighborhoods: Neighborhood[];
  initialServiceSlug?: string;
}

/**
 * Formulário guiado de solicitação (Fase 1: DEMONSTRATIVO).
 *
 * Valida cada etapa com as mesmas regras (Zod) que o servidor usará na Fase 2,
 * mas não envia nem armazena nenhum dado.
 */
export function RequestWizard({ categories, neighborhoods, initialServiceSlug }: Props) {
  const allServices = useMemo(() => categories.flatMap((c) => c.services), [categories]);
  const initialService = allServices.find((s) => s.slug === initialServiceSlug);

  const [values, setValues] = useState<RequestFormValues>({
    ...EMPTY_REQUEST_FORM,
    serviceSlug: initialService?.slug ?? "",
  });
  const [stepIndex, setStepIndex] = useState(initialService ? 1 : 0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [activeCategory, setActiveCategory] = useState(initialService?.categorySlug ?? categories[0]?.slug ?? "");
  const [showResult, setShowResult] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const step = REQUEST_STEPS[stepIndex];
  const service = allServices.find((s) => s.slug === values.serviceSlug);
  const category = categories.find((c) => c.slug === service?.categorySlug);
  const isLast = stepIndex === REQUEST_STEPS.length - 1;

  function update<K extends keyof RequestFormValues>(key: K, value: RequestFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function updateAnswer(id: string, value: string) {
    setValues((v) => ({ ...v, answers: { ...v.answers, [id]: value } }));
    setErrors((e) => ({ ...e, [`answers.${id}`]: undefined }));
  }

  function goTo(index: number) {
    setErrors({});
    setStepIndex(index);
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function next() {
    const found = validateStep(step.id, values, service?.questions);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    if (isLast) {
      setShowResult(true);
      return;
    }
    goTo(stepIndex + 1);
  }

  function selectService(slug: string) {
    if (slug !== values.serviceSlug) {
      // Respostas contextuais pertencem ao serviço anterior.
      setValues((v) => ({ ...v, serviceSlug: slug, answers: {} }));
    }
    setErrors({});
  }

  const urgencyLabel = URGENCY_OPTIONS.find((o) => o.value === values.urgency)?.label;
  const periodLabel = PERIOD_OPTIONS.find((o) => o.value === values.preferredPeriod)?.label;
  const neighborhoodName = neighborhoods.find((n) => n.slug === values.neighborhoodSlug)?.name;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
        className="min-w-0 rounded-xl border border-line bg-surface shadow-card"
      >
        <div className="border-b border-line p-5 sm:p-8">
          <Stepper steps={REQUEST_STEPS} current={stepIndex} />
        </div>

        <div className="p-5 sm:p-8">
          <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold outline-none">
            {step.description}
          </h2>

          <div key={step.id} className="mt-6 animate-fade-up space-y-7">
            {step.id === "service" && (
              <>
                <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
                  <div role="tablist" aria-label="Categorias" className="flex gap-2">
                    {categories.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        role="tab"
                        aria-selected={activeCategory === c.slug}
                        onClick={() => setActiveCategory(c.slug)}
                        className={cn(
                          "rounded-full border px-3.5 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
                          activeCategory === c.slug
                            ? "border-ink bg-ink text-ink-inverse"
                            : "border-line-strong text-ink-muted hover:border-ink-subtle",
                        )}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
                <ChoiceGroup
                  name="serviceSlug"
                  legend="Serviço"
                  hideLegend
                  value={values.serviceSlug}
                  onChange={selectService}
                  error={errors.serviceSlug}
                  options={(categories.find((c) => c.slug === activeCategory)?.services ?? []).map((s) => ({
                    value: s.slug,
                    label: s.name,
                    description: s.summary,
                    icon: (
                      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-700">
                        <ServiceIcon icon={s.icon} className="size-4.5" />
                      </span>
                    ),
                  }))}
                />
              </>
            )}

            {step.id === "details" && service && (
              <>
                {service.questions.map((q) => (
                  <ChoiceGroup
                    key={q.id}
                    name={`q-${q.id}`}
                    legend={q.label}
                    optional={!q.required}
                    variant="pill"
                    value={values.answers[q.id] ?? ""}
                    onChange={(v) => updateAnswer(q.id, v)}
                    error={errors[`answers.${q.id}`]}
                    options={q.options}
                  />
                ))}
                <Field
                  id="description"
                  label="Descreva o que você precisa"
                  error={errors.description}
                  hint={`Quanto mais claro, melhor. Não inclua telefone, e-mail ou endereço completo. Mínimo de ${DESCRIPTION_MIN} caracteres.`}
                >
                  {(a) => (
                    <div>
                      <Textarea
                        id={a.id}
                        aria-describedby={a.describedBy}
                        invalid={a.invalid}
                        maxLength={DESCRIPTION_MAX}
                        rows={5}
                        value={values.description}
                        onChange={(e) => update("description", e.target.value)}
                        placeholder={`Ex.: Preciso de um ${service.name.toLowerCase()} para…`}
                      />
                      <p className="mt-1 text-right text-xs text-ink-subtle tabular-nums" aria-live="polite">
                        {values.description.trim().length}/{DESCRIPTION_MAX}
                      </p>
                    </div>
                  )}
                </Field>
                <Alert tone="info" title="Fotos">
                  O envio de fotos do problema estará disponível em uma próxima versão.
                </Alert>
              </>
            )}

            {step.id === "location" && (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="city" label="Cidade" hint="No momento, atendemos somente Joinville.">
                    {(a) => (
                      <Select id={a.id} aria-describedby={a.describedBy} value={values.citySlug} disabled>
                        <option value="joinville">Joinville, SC</option>
                      </Select>
                    )}
                  </Field>
                  <Field id="neighborhood" label="Bairro" error={errors.neighborhoodSlug}>
                    {(a) => (
                      <Select
                        id={a.id}
                        aria-describedby={a.describedBy}
                        invalid={a.invalid}
                        value={values.neighborhoodSlug}
                        onChange={(e) => update("neighborhoodSlug", e.target.value)}
                      >
                        <option value="">Selecione o bairro</option>
                        {neighborhoods.map((n) => (
                          <option key={n.slug} value={n.slug}>
                            {n.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </div>
                <ChoiceGroup
                  name="urgency"
                  legend="Para quando você precisa?"
                  value={values.urgency}
                  onChange={(v) => update("urgency", v)}
                  error={errors.urgency}
                  options={URGENCY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                />
                <ChoiceGroup
                  name="preferredPeriod"
                  legend="Período de preferência"
                  variant="pill"
                  value={values.preferredPeriod}
                  onChange={(v) => update("preferredPeriod", v)}
                  error={errors.preferredPeriod}
                  options={PERIOD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                />
                <Field
                  id="budget"
                  label="Orçamento estimado"
                  optional
                  error={errors.budget}
                  hint="Apenas uma referência. O valor final é combinado com o profissional."
                  className="sm:max-w-xs"
                >
                  {(a) => (
                    <div className="relative">
                      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[0.9375rem] text-ink-subtle">
                        R$
                      </span>
                      <Input
                        id={a.id}
                        aria-describedby={a.describedBy}
                        invalid={a.invalid}
                        inputMode="decimal"
                        className="pl-10"
                        placeholder="0,00"
                        value={values.budget}
                        onChange={(e) => update("budget", e.target.value)}
                      />
                    </div>
                  )}
                </Field>
              </>
            )}

            {step.id === "review" && (
              <>
                <dl className="divide-y divide-line rounded-lg border border-line">
                  <SummaryRow label="Serviço" onEdit={() => goTo(0)}>
                    {service?.name} <span className="text-ink-subtle">· {category?.name}</span>
                  </SummaryRow>
                  <SummaryRow label="Descrição" onEdit={() => goTo(1)}>
                    <span className="whitespace-pre-line">{values.description.trim()}</span>
                    {service?.questions.map((q) => {
                      const answer = q.options.find((o) => o.value === values.answers[q.id]);
                      return answer ? (
                        <span key={q.id} className="mt-1 block text-ink-muted">
                          {q.label} <strong className="text-ink">{answer.label}</strong>
                        </span>
                      ) : null;
                    })}
                  </SummaryRow>
                  <SummaryRow label="Local e prazo" onEdit={() => goTo(2)}>
                    {neighborhoodName}, Joinville
                    <span className="block text-ink-muted">
                      {urgencyLabel} · {periodLabel}
                      {values.budget && ` · Orçamento: R$ ${values.budget}`}
                    </span>
                  </SummaryRow>
                </dl>

                <div
                  className={cn(
                    "rounded-lg border p-4 sm:p-5",
                    errors.contactConsent ? "border-danger-600/50 bg-danger-50/40" : "border-brand-100 bg-brand-50/60",
                  )}
                >
                  <div className="flex gap-3">
                    <input
                      id="contactConsent"
                      type="checkbox"
                      checked={values.contactConsent}
                      onChange={(e) => update("contactConsent", e.target.checked)}
                      aria-describedby="contactConsent-desc contactConsent-error"
                      className="mt-1 size-4.5 shrink-0 accent-brand-700"
                    />
                    <div>
                      <label htmlFor="contactConsent" className="font-semibold text-ink">
                        Autorizo o compartilhamento do meu contato com os profissionais que eu escolher
                      </label>
                      <p id="contactConsent-desc" className="mt-1 text-sm leading-relaxed text-ink-muted">
                        Profissionais compatíveis verão apenas o serviço, o bairro e a descrição. Seu telefone só será
                        liberado para quem você selecionar, até {MAX_CONTACT_GRANTS_PER_REQUEST} profissionais por
                        solicitação. Você pode revogar essa autorização a qualquer momento.
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pl-7.5">
                    <FieldError id="contactConsent-error" message={errors.contactConsent} />
                  </div>
                </div>

                <Alert tone="warning" title="Versão de demonstração">
                  Na versão funcional, você fará login ou criará sua conta antes de publicar. Nesta fase, nenhuma
                  informação é enviada ou armazenada.
                </Alert>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line p-5 sm:px-8">
          {stepIndex > 0 ? (
            <Button variant="ghost" onClick={() => goTo(stepIndex - 1)}>
              <ArrowLeft /> Voltar
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" size="lg">
            {isLast ? "Publicar solicitação" : "Continuar"}
            {!isLast && <ArrowRight />}
          </Button>
        </div>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="text-[0.8125rem] font-bold tracking-wide text-ink-subtle uppercase">Resumo</p>
          {service ? (
            <div className="mt-3 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-md bg-brand-50 text-brand-700">
                <ServiceIcon icon={service.icon} />
              </span>
              <div>
                <p className="font-bold">{service.name}</p>
                <p className="text-[0.8125rem] text-ink-muted">{neighborhoodName ?? "Joinville"}</p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">Escolha um serviço para começar.</p>
          )}
        </div>
        <div className="flex gap-3 rounded-lg border border-line bg-surface p-5 text-sm text-ink-muted">
          <Lock aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-600" />
          <p>Seus dados de contato não aparecem para os profissionais sem a sua autorização.</p>
        </div>
      </aside>

      <Dialog
        open={showResult}
        onClose={() => setShowResult(false)}
        title="Solicitação não enviada (protótipo)"
        description={
          <>
            <span className="flex items-start gap-2">
              <FlaskConical aria-hidden className="mt-1 size-4 shrink-0 text-warning-700" />
              <span>
                Você concluiu o fluxo de demonstração. Esta é a Fase 1 do ORBE Serviços: a solicitação{" "}
                <strong className="text-ink">não foi publicada</strong> e nenhum profissional foi notificado.
              </span>
            </span>
          </>
        }
      >
        <p className="text-sm text-ink-muted">
          Na versão funcional, a solicitação será salva com segurança, você poderá acompanhá-la em “Minhas
          solicitações” e receberá o interesse de profissionais compatíveis.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setShowResult(false)}>
            Revisar dados
          </Button>
          <ButtonLink href="/" onNavigate={() => setShowResult(false)}>
            Voltar ao início
          </ButtonLink>
        </div>
      </Dialog>
    </div>
  );
}

function SummaryRow({
  label,
  children,
  onEdit,
}: {
  label: string;
  children: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="flex gap-4 p-4">
      <div className="min-w-0 flex-1">
        <dt className="text-[0.8125rem] font-semibold text-ink-subtle">{label}</dt>
        <dd className="mt-1 text-[0.9375rem] break-words">{children}</dd>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex h-8 items-center gap-1.5 self-start rounded-md px-2.5 text-[0.8125rem] font-semibold text-brand-700 hover:bg-brand-50"
      >
        <Pencil aria-hidden className="size-3.5" /> Editar
        <span className="sr-only"> {label.toLowerCase()}</span>
      </button>
    </div>
  );
}
