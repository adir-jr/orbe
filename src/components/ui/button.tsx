import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.1em] [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary: "bg-brand-700 text-ink-inverse shadow-card hover:bg-brand-800",
  secondary: "bg-brand-50 text-brand-800 hover:bg-brand-100",
  outline: "border border-line-strong bg-surface text-ink hover:border-ink-subtle hover:bg-subtle",
  ghost: "text-ink-muted hover:bg-subtle hover:text-ink",
  inverse: "bg-surface text-brand-900 hover:bg-brand-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 rounded-md px-3.5 text-sm",
  md: "h-11 rounded-md px-5 text-[0.9375rem]",
  lg: "h-13 rounded-lg px-6 text-base",
};

export function buttonStyles(opts: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[opts.variant ?? "primary"], sizes[opts.size ?? "md"], opts.className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
