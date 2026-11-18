import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function Section({ className, ...props }: ComponentProps<"section">) {
  return <section className={cn("py-16 sm:py-20", className)} {...props} />;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-[0.8125rem] font-bold tracking-[0.08em] text-brand-600 uppercase">{eyebrow}</p>
      )}
      <h2 className="text-[1.75rem] leading-tight font-extrabold sm:text-[2.125rem]">{title}</h2>
      {description && <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg">{description}</p>}
    </div>
  );
}
