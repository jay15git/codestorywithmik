import Image from "next/image"
import Link from "next/link"

export function SidebarBrand() {
  return (
    <Link
      href="/"
      data-cuelume-press=""
      data-cuelume-release=""
      className="flex h-10 items-center gap-3"
    >
      <Image
        src="/leetseek-logo.png"
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0 rounded-lg object-cover object-top ring-1 ring-black/10 ring-inset dark:ring-white/10"
      />
      <span className="text-base leading-none font-semibold tracking-tight">
        LeetSeek
      </span>
    </Link>
  )
}
