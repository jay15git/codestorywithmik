const SHIKI_ALLOWED_TAGS = new Set(["pre", "code", "span", "div", "br", "line"])
const SHIKI_ALLOWED_ATTR = new Set(["class", "style"])

/**
 * Allowlist sanitizer for Shiki HTML.
 * Avoids isomorphic-dompurify/jsdom, which crash on Vercel (ERR_REQUIRE_ESM).
 */
export function sanitizeShikiHtml(html: string): string {
  const withoutBlocked = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")

  return withoutBlocked.replace(
    /<\/?([a-zA-Z][\w:-]*)\b([^>]*)\/?>/g,
    (token, rawTag, rawAttrs) => {
      const tag = String(rawTag).toLowerCase()
      const isClosing = token.startsWith("</")
      const selfClosing = /\/>$/.test(token)

      if (!SHIKI_ALLOWED_TAGS.has(tag)) {
        return ""
      }

      if (isClosing) {
        return `</${tag}>`
      }

      const attrs = sanitizeAttributes(String(rawAttrs ?? ""))
      if (selfClosing || tag === "br") {
        return `<${tag}${attrs} />`
      }

      return `<${tag}${attrs}>`
    },
  )
}

function sanitizeAttributes(rawAttrs: string): string {
  const kept: string[] = []
  const attrPattern =
    /([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g

  for (const match of rawAttrs.matchAll(attrPattern)) {
    const name = match[1].toLowerCase()
    if (!SHIKI_ALLOWED_ATTR.has(name)) {
      continue
    }

    const value = match[2] ?? match[3] ?? match[4] ?? ""
    if (name === "style" && /expression\s*\(|url\s*\(\s*['"]?\s*javascript:/i.test(value)) {
      continue
    }

    kept.push(` ${name}="${value.replace(/"/g, "&quot;")}"`)
  }

  return kept.join("")
}
