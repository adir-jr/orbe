import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "danger";

const styles: Record<Tone, { box: string; icon: typeof Info }> = {
  info: { box: "border-brand-100 bg-brand-50 text-brand-900", icon: Info },
  success: { box: "border-success-700/15 bg-success-50 text-success-700", icon: CheckCircle2 },
  warning: { box: "border-warning-200 bg-warning-50 text-warning-700", icon: AlertTriangle },
  danger: { box: "border-danger-600/20 bg-danger-50 text-danger-700", icon: XCircle },
};

/** Notificação inline. Use `role="status"` para mensagens não urgentes. */
export function Alert({
  tone = "info",
  title,
  children,
  className,
  role = "status",
}: {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  role?: "status" | "alert";
}) {
  const { box, icon: Icon } = styles[tone];
  return (
    <div role={role} className={cn("flex gap-3 rounded-md border px-4 py-3 text-sm", box, className)}>
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div className="flex flex-col gap-0.5 leading-relaxed">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="opacity-90">{children}</div>}
      </div>
    </div>
  );
}
