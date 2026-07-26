import {
  Facebook02Icon,
  Github01Icon,
  InstagramIcon,
  Linkedin02Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ButtonLink } from "@/components/button-link"

const SOCIAL_LINKS = [
  {
    icon: Linkedin02Icon,
    label: "LinkedIn",
    href: "https://linkedin.com/in/mazhar-imam-khan-95a34ab3",
  },
  {
    icon: Github01Icon,
    label: "GitHub",
    href: "https://github.com/MAZHARMIK/Interview_DS_Algo",
  },
  {
    icon: Facebook02Icon,
    label: "Facebook",
    href: "https://facebook.com/profile.php?id=100090524295846",
  },
  {
    icon: InstagramIcon,
    label: "Instagram",
    href: "https://instagram.com/codestorywithmik",
  },
  {
    icon: NewTwitterIcon,
    label: "Twitter",
    href: "https://twitter.com/CSwithMIK",
  },
] as const

export function SocialLinks() {
  return (
    <>
      {SOCIAL_LINKS.map((link) => (
        <ButtonLink
          key={link.label}
          variant="ghost"
          size="icon"
          href={link.href}
          external
          aria-label={link.label}
          className="text-muted-foreground hover:text-foreground"
        >
          <HugeiconsIcon icon={link.icon} className="size-4" strokeWidth={1.5} />
        </ButtonLink>
      ))}
    </>
  )
}
