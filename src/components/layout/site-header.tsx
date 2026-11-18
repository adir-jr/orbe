import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { mainNav } from "@/lib/site";
import { Container } from "./container";
import { MobileMenu } from "./mobile-menu";
import { NavLink } from "./nav-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/75">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/entrar"
            className="rounded-md px-3 py-2 text-[0.9375rem] font-semibold text-ink-muted hover:text-ink"
          >
            Entrar
          </Link>
          <ButtonLink href="/solicitar" size="sm">
            Solicitar serviço
          </ButtonLink>
        </div>

        <MobileMenu items={mainNav} />
      </Container>
    </header>
  );
}
