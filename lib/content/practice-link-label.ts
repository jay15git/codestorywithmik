export function practiceLinkLabel(url: string): string {
  if (url.includes("leetcode.com")) {
    return "LeetCode"
  }

  if (url.includes("geeksforgeeks.org")) {
    return "GFG"
  }

  if (url.includes("cses.fi")) {
    return "CSES"
  }

  return "Practice"
}
