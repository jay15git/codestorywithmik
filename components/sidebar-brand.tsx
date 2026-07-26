import Link from "next/link"

export function SidebarBrand() {
  return (
    <Link href="/" className="flex h-10 items-center gap-3">
      <img
        src="/codestorywithmik-logo.png"
        alt=""
        className="size-10 shrink-0 rounded-lg object-cover object-top"
      />
      <span className="text-base font-semibold tracking-tight leading-none">
        codestorywithMIK
      </span>
    </Link>
  )
}
