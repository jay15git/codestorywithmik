import { NextResponse, type NextRequest } from "next/server"

import solutionSlugsJson from "@/generated/solution-slugs.json"

const solutionSlugs = new Set(solutionSlugsJson as string[])

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.slice("/solutions/".length)

  if (solutionSlugs.has(slug)) {
    return NextResponse.next()
  }

  return NextResponse.rewrite(new URL("/__missing-solution", request.url), {
    status: 404,
  })
}

export const config = {
  matcher: "/solutions/:slug",
}
