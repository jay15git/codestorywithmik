import Link from "next/link"

export function SidebarBrand() {
  return (
    <div className="flex flex-col gap-1">
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
      <p className="text-xs text-muted-foreground">
        frontend by{" "}
        <a
          href="https://www.itsjay.in"
          target="_blank"
          rel="noreferrer"
          className="underline-offset-2 hover:text-foreground hover:underline"
        >
          Jayant
        </a>
      </p>
    </div>
  )
}
