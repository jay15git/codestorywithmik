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
        "t-tactile duration-quick inline-flex max-w-[9rem] items-center overflow-hidden truncate text-xs font-medium leading-none text-muted-foreground transition-[color,transform] ease-smooth-out hover:text-foreground",
        className
      )}
    >
      {company}
    </Link>
  )
}
