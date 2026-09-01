import Link from "next/link";
import { ScanLine } from "lucide-react";
import { PRODUCT } from "@/lib/constants";
import { cn } from "@/lib/utils/format";

export function Brand({ compact = false, href = "/" }: { compact?: boolean; href?: string }) {
  return <Link href={href} className={cn("brand", compact && "brand-compact")}><span className="brand-mark"><ScanLine size={20} /></span><span><strong>{PRODUCT.name}</strong>{!compact && <small>{PRODUCT.subtitle}</small>}</span></Link>;
}

