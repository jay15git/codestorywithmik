import Link from "next/link"

import { companySlug } from "@/lib/content/slug"
import { cn } from "@/lib/utils"

interface CompanyTagLinkProps {
  company: string
  className?: string
}

export function CompanyTagLink({ company, className }: CompanyTagLinkProps) {
  return (
    <Link
      href={`/companies/${companySlug(company)}`}
      data-cuelume-press=""
      data-cuelume-release=""
      className={cn(
        "t-tactile duration-quick text-xs font-medium text-muted-foreground transition-[color,transform] ease-smooth-out hover:text-foreground",
        className
      )}
    >
      {company}
    </Link>
  )
}
