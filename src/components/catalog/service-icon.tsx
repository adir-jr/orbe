import {
  Aperture,
  BrickWall,
  Briefcase,
  Building2,
  Camera,
  Car,
  Droplet,
  Fence,
  Flame,
  Hammer,
  House,
  Leaf,
  Monitor,
  Paintbrush,
  PenTool,
  Ruler,
  Snowflake,
  Sofa,
  Sparkles,
  AppWindow,
  WashingMachine,
  Wifi,
  Wrench,
  Zap,
  BrushCleaning,
  Drill,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/domain/types";
import { cn } from "@/lib/utils";

/**
 * Os dados guardam apenas uma chave de ícone (texto), não o componente.
 * Assim o banco não depende da biblioteca de ícones usada no frontend.
 */
const ICONS: Record<IconKey, LucideIcon> = {
  home: House,
  sparkles: Sparkles,
  wrench: Wrench,
  hammer: Hammer,
  briefcase: Briefcase,
  zap: Zap,
  droplet: Droplet,
  paintbrush: Paintbrush,
  brick: BrickWall,
  sofa: Sofa,
  tool: Drill,
  broom: BrushCleaning,
  building: Building2,
  leaf: Leaf,
  snowflake: Snowflake,
  washing: WashingMachine,
  wifi: Wifi,
  camera: Camera,
  flame: Flame,
  fence: Fence,
  ruler: Ruler,
  window: AppWindow,
  aperture: Aperture,
  pen: PenTool,
  monitor: Monitor,
  car: Car,
};

export function ServiceIcon({ icon, className }: { icon: IconKey; className?: string }) {
  const Icon = ICONS[icon] ?? Wrench;
  return <Icon aria-hidden className={cn("size-5", className)} strokeWidth={1.75} />;
}

export function IconTile({
  icon,
  size = "md",
  className,
}: {
  icon: IconKey;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box = { sm: "size-9 rounded-md", md: "size-11 rounded-md", lg: "size-14 rounded-lg" }[size];
  const glyph = { sm: "size-4", md: "size-5", lg: "size-6" }[size];
  return (
    <span className={cn("grid shrink-0 place-items-center bg-brand-50 text-brand-700 ring-1 ring-brand-100 ring-inset", box, className)}>
      <ServiceIcon icon={icon} className={glyph} />
    </span>
  );
}
