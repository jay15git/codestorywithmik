export type TagKind = "default" | "custom"

export interface UserTag {
  id: string
  name: string
  kind: TagKind
  color?: string
}

export interface TagState {
  definitions: UserTag[]
  assignments: Record<string, string[]>
}

export type TagAssignmentsMap = TagState["assignments"]

export interface TagCounts {
  starred: number
  custom: number
}
