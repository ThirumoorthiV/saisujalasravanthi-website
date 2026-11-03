import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "light" | "outline-light";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-maroon-700 text-white hover:bg-maroon-600",
  secondary: "border-2 border-maroon-700 text-maroon-700 hover:bg-maroon-100",
  light: "bg-white text-maroon-700 hover:bg-maroon-100",
  "outline-light": "border-2 border-white/80 text-white hover:bg-white/10",
};

export const buttonClass = (variant: Variant = "primary") =>
  `inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold sm:min-h-[44px] sm:px-5 sm:py-2.5 sm:text-base transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 ${VARIANTS[variant]}`;

interface ButtonLinkProps {
  to: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}

export function ButtonLink({ to, children, variant = "primary", className = "" }: ButtonLinkProps) {
  const cls = `${buttonClass(variant)} ${className}`;
  if (/^(https?:|mailto:|tel:|#$)/.test(to)) {
    return (
      <a href={to} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}
