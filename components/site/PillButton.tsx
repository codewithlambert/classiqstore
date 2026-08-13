import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type PillButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
};

export default function PillButton({
  children,
  href,
  onClick,
  className = "",
}: PillButtonProps) {
  const cls = `inline-flex items-center gap-2 rounded-full border border-foreground/25 px-6 py-2.5 text-sm text-foreground transition-colors duration-200 hover:border-foreground hover:bg-foreground hover:text-background ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
        <ArrowUpRight size={15} strokeWidth={1.5} />
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
      <ArrowUpRight size={15} strokeWidth={1.5} />
    </button>
  );
}
