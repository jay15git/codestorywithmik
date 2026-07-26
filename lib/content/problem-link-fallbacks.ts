/**
 * Manual problem links when upstream files omit parseable URLs.
 * Prefer GFG for educational / non-LeetCode content.
 */
export const PROBLEM_LINK_FALLBACKS: Record<
  string,
  { leetcodeUrl?: string; gfgUrl?: string }
> = {
  "graph-bfs-traversal": {
    gfgUrl:
      "https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph/1",
  },
  "tree-diagonal-tree-traversal-recursive-using-map": {
    gfgUrl:
      "https://practice.geeksforgeeks.org/problems/diagonal-traversal-of-binary-tree/1",
  },
  "graph-disjoint-set-disjoint-set-union-find-rank-pathcompression": {
    gfgUrl:
      "https://practice.geeksforgeeks.org/problems/disjoint-set-union-find/1",
  },
  "graph-disjoint-set-disjoint-set-union-find-size": {
    gfgUrl:
      "https://practice.geeksforgeeks.org/problems/disjoint-set-union-find/1",
  },
  "mathematical-matrix-exponentiation": {
    gfgUrl:
      "https://practice.geeksforgeeks.org/problems/matrix-exponentiation2717/1",
  },
  "dp-printing-all-longest-common-subsequences": {
    gfgUrl:
      "https://practice.geeksforgeeks.org/problems/print-all-lcs-sequences3413/1",
  },
  "segment-tree-range-maximum-index-query": {
    gfgUrl:
      "https://practice.geeksforgeeks.org/problems/segment-tree-and-lazy-propagation/1",
  },
  "design-search-suggestions-system": {
    leetcodeUrl: "https://leetcode.com/problems/search-suggestions-system/",
  },
  "mathematical-shuffle-an-array": {
    leetcodeUrl: "https://leetcode.com/problems/shuffle-an-array/",
  },
  "graph-topological-sorting-topological-sort-dfs": {
    gfgUrl: "https://practice.geeksforgeeks.org/problems/topological-sort/1",
  },
  "backtracking-tug-of-war": {
    gfgUrl: "https://practice.geeksforgeeks.org/problems/tug-of-war/1",
  },
  "cses-meet-in-the-middle-mitm-cses-1628-meet-in-the-middle": {
    gfgUrl: "https://cses.fi/problemset/task/1628/",
  },
  "greedy-minimum-deletion-cost-to-avoid-repeating-letters": {
    leetcodeUrl:
      "https://leetcode.com/problems/minimum-deletion-cost-to-avoid-repeating-letters/",
  },
  "arrays-minimum-lights-to-activate": {
    gfgUrl:
      "https://practice.geeksforgeeks.org/problems/minimum-number-of-taps-to-open-to-water-a-garden/1",
  },
}
