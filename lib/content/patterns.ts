import { topicSlugFromName } from "@/lib/content/slug"
import type { Difficulty, SolutionMeta } from "@/lib/content/types"

export interface PatternDefinition {
  slug: string
  name: string
  description: string
  /** Match if solution has any of these LeetCode topic tags. */
  topicTags: string[]
}

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
}

/**
 * Interview-oriented pattern groups over existing LeetCode topic tags.
 * Not a scrape — curated mapping only.
 */
export const PATTERN_DEFINITIONS: PatternDefinition[] = [
  {
    slug: "two-pointers",
    name: "Two Pointers",
    description: "Pair ends, opposite ends, or slow/fast pointers on arrays and strings.",
    topicTags: ["Two Pointers"],
  },
  {
    slug: "sliding-window",
    name: "Sliding Window",
    description: "Fixed or variable windows over contiguous subarrays and substrings.",
    topicTags: ["Sliding Window"],
  },
  {
    slug: "prefix-sum",
    name: "Prefix Sum",
    description: "Precompute running sums for range queries and subarray tricks.",
    topicTags: ["Prefix Sum"],
  },
  {
    slug: "binary-search",
    name: "Binary Search",
    description: "Search sorted space, answer space, or monotonic predicates.",
    topicTags: ["Binary Search"],
  },
  {
    slug: "stack-monotonic",
    name: "Stack & Monotonic Stack",
    description: "Next greater/smaller, valid parentheses, and stack simulation.",
    topicTags: ["Stack", "Monotonic Stack"],
  },
  {
    slug: "heap",
    name: "Heap / Priority Queue",
    description: "Top-k, scheduling, and merge problems with a heap.",
    topicTags: ["Heap (Priority Queue)"],
  },
  {
    slug: "linked-list",
    name: "Linked List",
    description: "Pointer rewiring, reverse, cycle detection, and merge.",
    topicTags: ["Linked List", "Doubly-Linked List"],
  },
  {
    slug: "trees",
    name: "Trees",
    description: "Binary trees, BST property, and recursive tree DP.",
    topicTags: ["Tree", "Binary Tree", "Binary Search Tree"],
  },
  {
    slug: "graphs-bfs-dfs",
    name: "Graphs: BFS & DFS",
    description: "Traversals, connectivity, and grid/graph search.",
    topicTags: ["Breadth-First Search", "Depth-First Search", "Graph Theory"],
  },
  {
    slug: "topological-sort",
    name: "Topological Sort",
    description: "Ordering with prerequisites and cycle detection in DAGs.",
    topicTags: ["Topological Sort"],
  },
  {
    slug: "union-find",
    name: "Union-Find",
    description: "Disjoint sets for connectivity and component merging.",
    topicTags: ["Union-Find"],
  },
  {
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    description:
      "Optimal substructure: 1D/2D DP, knapsack-style, and memoization.",
    topicTags: ["Dynamic Programming", "Memoization"],
  },
  {
    slug: "backtracking",
    name: "Backtracking",
    description:
      "Explore candidates with undo: subsets, permutations, constraints.",
    topicTags: ["Backtracking"],
  },
  {
    slug: "greedy",
    name: "Greedy",
    description: "Local best choices when the pattern fits.",
    topicTags: ["Greedy"],
  },
  {
    slug: "bit-manipulation",
    name: "Bit Manipulation",
    description: "XOR tricks, bitmasks, and low-level integer operations.",
    topicTags: ["Bit Manipulation", "Bitmask"],
  },
  {
    slug: "trie",
    name: "Trie",
    description: "Prefix trees for word search and autocomplete-style problems.",
    topicTags: ["Trie"],
  },
]

export function getPatterns(): PatternDefinition[] {
  return PATTERN_DEFINITIONS
}

export function getPattern(slug: string): PatternDefinition | undefined {
  return PATTERN_DEFINITIONS.find((pattern) => pattern.slug === slug)
}

export function solutionMatchesPattern(
  solution: SolutionMeta,
  pattern: PatternDefinition,
): boolean {
  const tags = new Set(solution.topicTags)
  return pattern.topicTags.some((tag) => tags.has(tag))
}

export function getSolutionsForPattern(
  pattern: PatternDefinition,
  solutions: SolutionMeta[],
): SolutionMeta[] {
  return solutions
    .filter((solution) => solutionMatchesPattern(solution, pattern))
    .sort(comparePatternOrder)
}

export function comparePatternOrder(
  left: SolutionMeta,
  right: SolutionMeta,
): number {
  const leftDiff = left.difficulty ? DIFFICULTY_RANK[left.difficulty] : 99
  const rightDiff = right.difficulty ? DIFFICULTY_RANK[right.difficulty] : 99
  if (leftDiff !== rightDiff) {
    return leftDiff - rightDiff
  }

  const leftId = left.leetcodeId ?? Number.MAX_SAFE_INTEGER
  const rightId = right.leetcodeId ?? Number.MAX_SAFE_INTEGER
  if (leftId !== rightId) {
    return leftId - rightId
  }

  return left.title.localeCompare(right.title)
}

export function patternTopicHrefs(pattern: PatternDefinition) {
  return pattern.topicTags.map((tag) => ({
    name: tag,
    href: `/topics/${topicSlugFromName(tag)}`,
  }))
}
