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
        src="/icon-192.png"
        alt="LeetSeek"
        width={40}
        height={40}
        className="size-10 shrink-0 object-contain"
      />
      <span className="text-base leading-none font-semibold tracking-tight">
        LeetSeek
      </span>
    </Link>
  )
}
