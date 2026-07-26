import DOMPurify from "isomorphic-dompurify"

const SHIKI_ALLOWED_TAGS = ["pre", "code", "span", "div", "br", "line"]
const SHIKI_ALLOWED_ATTR = ["class", "style"]

export function sanitizeShikiHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: SHIKI_ALLOWED_TAGS,
    ALLOWED_ATTR: SHIKI_ALLOWED_ATTR,
  })
}
