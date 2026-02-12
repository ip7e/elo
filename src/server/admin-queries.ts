import "server-only"
import createSuperClient from "./supabase"

export type AdminStats = {
  totalCircles: number
  circlesLast7Days: number
  circlesLast30Days: number
  totalGames: number
  unlockedCircles: number
  freeCircles: number
  totalUsers: number
}

export type AdminCircleRow = {
  id: number
  name: string
  slug: string
  is_unlocked: boolean
  created_at: string
  memberCount: number
  gameCount: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createSuperClient()

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [circlesResult, circles7dResult, circles30dResult, gamesResult, unlockedResult, usersResult] =
    await Promise.all([
      supabase.from("circles").select("id", { count: "exact", head: true }),
      supabase.from("circles").select("id", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
      supabase.from("circles").select("id", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
      supabase.from("games").select("id", { count: "exact", head: true }),
      supabase.from("circles").select("id", { count: "exact", head: true }).eq("is_unlocked", true),
      supabase.from("profiles").select("user_id", { count: "exact", head: true }),
    ])

  const totalCircles = circlesResult.count ?? 0

  return {
    totalCircles,
    circlesLast7Days: circles7dResult.count ?? 0,
    circlesLast30Days: circles30dResult.count ?? 0,
    totalGames: gamesResult.count ?? 0,
    unlockedCircles: unlockedResult.count ?? 0,
    freeCircles: totalCircles - (unlockedResult.count ?? 0),
    totalUsers: usersResult.count ?? 0,
  }
}

export async function getRecentCircles(): Promise<AdminCircleRow[]> {
  const supabase = createSuperClient()

  const { data: circles } = await supabase
    .from("circles")
    .select("*, members:circle_members(count), games:games(count)")
    .order("created_at", { ascending: false })
    .limit(50)

  if (!circles) return []

  return circles.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    is_unlocked: c.is_unlocked,
    created_at: c.created_at,
    memberCount: (c.members as unknown as { count: number }[])?.[0]?.count ?? 0,
    gameCount: (c.games as unknown as { count: number }[])?.[0]?.count ?? 0,
  }))
}
