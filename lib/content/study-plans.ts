import type { SolutionMeta } from "@/lib/content/types"

export interface StudyPlanGroup {
  name: string
  leetcodeIds: number[]
}

export interface StudyPlanDefinition {
  slug: string
  name: string
  description: string
  groups: StudyPlanGroup[]
}

/**
 * Curated interview study plans by LeetCode id (NeetCode Blind 75 / NeetCode 150).
 * Resolved against the local catalog — missing ids are skipped at read time.
 */
export const STUDY_PLAN_DEFINITIONS: StudyPlanDefinition[] = [
  {
    slug: "blind-75",
    name: "Blind 75",
    description:
      "Classic high-signal interview set — arrays through DP, in NeetCode Blind 75 order.",
    groups: [
      {
        name: "Arrays & Hashing",
        leetcodeIds: [217, 242, 1, 49, 347, 238, 271, 128],
      },
      { name: "Two Pointers", leetcodeIds: [125, 15, 11] },
      { name: "Sliding Window", leetcodeIds: [121, 3, 424, 76] },
      { name: "Stack", leetcodeIds: [20] },
      { name: "Binary Search", leetcodeIds: [153, 33] },
      { name: "Linked List", leetcodeIds: [206, 21, 143, 19, 141, 23] },
      {
        name: "Trees",
        leetcodeIds: [226, 104, 100, 572, 235, 102, 98, 230, 105, 124, 297],
      },
      { name: "Tries", leetcodeIds: [208, 211, 212] },
      { name: "Heap / Priority Queue", leetcodeIds: [295] },
      { name: "Backtracking", leetcodeIds: [39, 79] },
      { name: "Graphs", leetcodeIds: [200, 133, 417, 207, 323, 261, 269] },
      {
        name: "1-D DP",
        leetcodeIds: [70, 198, 213, 5, 647, 91, 322, 152, 139, 300],
      },
      { name: "2-D DP", leetcodeIds: [62, 1143] },
      { name: "Greedy", leetcodeIds: [53, 55] },
      { name: "Intervals", leetcodeIds: [57, 56, 435, 252, 253] },
      { name: "Math & Geometry", leetcodeIds: [48, 54, 73] },
      { name: "Bit Manipulation", leetcodeIds: [191, 338, 190, 268, 371] },
    ],
  },
  {
    slug: "neetcode-150",
    name: "NeetCode 150",
    description:
      "Broader roadmap covering Blind 75 plus extras across every major pattern.",
    groups: [
      {
        name: "Arrays & Hashing",
        leetcodeIds: [217, 242, 1, 49, 347, 271, 238, 36, 128],
      },
      { name: "Two Pointers", leetcodeIds: [125, 167, 15, 11, 42] },
      { name: "Sliding Window", leetcodeIds: [121, 3, 424, 567, 76, 239] },
      { name: "Stack", leetcodeIds: [20, 155, 150, 739, 853, 84] },
      {
        name: "Binary Search",
        leetcodeIds: [704, 74, 875, 153, 33, 981, 4],
      },
      {
        name: "Linked List",
        leetcodeIds: [206, 21, 141, 143, 19, 138, 2, 287, 146, 23, 25],
      },
      {
        name: "Trees",
        leetcodeIds: [
          226, 104, 543, 110, 100, 572, 235, 102, 199, 1448, 98, 230, 105, 124,
          297,
        ],
      },
      {
        name: "Heap / Priority Queue",
        leetcodeIds: [703, 1046, 973, 215, 621, 355, 295],
      },
      {
        name: "Backtracking",
        leetcodeIds: [78, 39, 40, 46, 90, 22, 79, 131, 17, 51],
      },
      { name: "Tries", leetcodeIds: [208, 211, 212] },
      {
        name: "Graphs",
        leetcodeIds: [
          200, 695, 133, 286, 994, 417, 130, 207, 210, 261, 323, 684, 127,
        ],
      },
      {
        name: "Advanced Graphs",
        leetcodeIds: [743, 332, 1584, 778, 269, 787],
      },
      {
        name: "1-D Dynamic Programming",
        leetcodeIds: [70, 746, 198, 213, 5, 647, 91, 322, 152, 139, 300, 416],
      },
      {
        name: "2-D Dynamic Programming",
        leetcodeIds: [62, 1143, 309, 518, 494, 97, 329, 115, 72, 312, 10],
      },
      {
        name: "Greedy",
        leetcodeIds: [53, 55, 45, 134, 846, 1899, 763, 678],
      },
      { name: "Intervals", leetcodeIds: [57, 56, 435, 252, 253, 1851] },
      {
        name: "Math & Geometry",
        leetcodeIds: [48, 54, 73, 202, 66, 50, 43, 2013],
      },
      {
        name: "Bit Manipulation",
        leetcodeIds: [136, 191, 338, 190, 268, 371, 7],
      },
    ],
  },
]

export function getStudyPlans(): StudyPlanDefinition[] {
  return STUDY_PLAN_DEFINITIONS
}

export function getStudyPlan(slug: string): StudyPlanDefinition | undefined {
  return STUDY_PLAN_DEFINITIONS.find((plan) => plan.slug === slug)
}

export function studyPlanIdCount(plan: StudyPlanDefinition): number {
  return plan.groups.reduce((sum, group) => sum + group.leetcodeIds.length, 0)
}

function indexByLeetcodeId(
  solutions: SolutionMeta[],
): Map<number, SolutionMeta> {
  const map = new Map<number, SolutionMeta>()
  for (const solution of solutions) {
    if (solution.leetcodeId == null) continue
    if (!map.has(solution.leetcodeId)) {
      map.set(solution.leetcodeId, solution)
    }
  }
  return map
}

export function getSolutionsForStudyPlan(
  plan: StudyPlanDefinition,
  solutions: SolutionMeta[],
): SolutionMeta[] {
  const byId = indexByLeetcodeId(solutions)
  const seen = new Set<string>()
  const ordered: SolutionMeta[] = []

  for (const group of plan.groups) {
    for (const id of group.leetcodeIds) {
      const solution = byId.get(id)
      if (!solution || seen.has(solution.slug)) continue
      seen.add(solution.slug)
      ordered.push(solution)
    }
  }

  return ordered
}

export function getStudyPlanGroupsWithSolutions(
  plan: StudyPlanDefinition,
  solutions: SolutionMeta[],
): Array<{ name: string; solutions: SolutionMeta[] }> {
  const byId = indexByLeetcodeId(solutions)

  return plan.groups.map((group) => ({
    name: group.name,
    solutions: group.leetcodeIds
      .map((id) => byId.get(id))
      .filter((solution): solution is SolutionMeta => Boolean(solution)),
  }))
}
