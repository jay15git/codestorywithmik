import { NextResponse } from "next/server"
import { readFileSync, existsSync } from "node:fs"
import path from "node:path"

import {
  CONTENT_BRANCH,
  CONTENT_REPO_SLUG,
  GENERATED_INDEX_PATH,
} from "@/lib/content/constants"

async function getLatestUpstreamSha(): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${CONTENT_REPO_SLUG}/commits/${CONTENT_BRANCH}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "codestorywithmik-sync",
      },
      next: { revalidate: 0 },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch upstream commit: ${response.status}`)
  }

  const data = (await response.json()) as { sha: string }
  return data.sha
}

function getBuiltSha(): string | null {
  const indexPath = path.join(process.cwd(), GENERATED_INDEX_PATH)

  if (!existsSync(indexPath)) {
    return null
  }

  const index = JSON.parse(readFileSync(indexPath, "utf8")) as {
    upstreamSha: string
  }

  return index.upstreamSha
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 },
    )
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const latestSha = await getLatestUpstreamSha()
    const builtSha = getBuiltSha()
    const changed = builtSha !== latestSha

    if (changed) {
      const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL

      if (!deployHookUrl) {
        return NextResponse.json(
          {
            changed: true,
            latestSha,
            builtSha,
            error: "VERCEL_DEPLOY_HOOK_URL is not configured",
          },
          { status: 500 },
        )
      }

      const deployResponse = await fetch(deployHookUrl, { method: "POST" })

      if (!deployResponse.ok) {
        return NextResponse.json(
          {
            changed: true,
            latestSha,
            builtSha,
            error: `Deploy hook failed: ${deployResponse.status}`,
          },
          { status: 502 },
        )
      }
    }

    return NextResponse.json({
      changed,
      latestSha,
      builtSha,
      triggeredDeploy: changed,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Sync check failed",
      },
      { status: 500 },
    )
  }
}
