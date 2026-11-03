import {
  Baby,
  Droplets,
  GraduationCap,
  Handshake,
  HeartPulse,
  Hospital,
  LifeBuoy,
  type LucideProps,
  Pill,
  Scissors,
  ShieldPlus,
  Sprout,
  Stethoscope,
  Tent,
  Users,
} from "lucide-react";
import type { IconName } from "@/types";

const ICONS = {
  Baby,
  Droplets,
  GraduationCap,
  Handshake,
  HeartPulse,
  Hospital,
  LifeBuoy,
  Pill,
  Scissors,
  ShieldPlus,
  Sprout,
  Stethoscope,
  Tent,
  Users,
} satisfies Record<IconName, unknown>;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Component = ICONS[name];
  return <Component aria-hidden {...props} />;
}
