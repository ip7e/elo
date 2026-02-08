import "server-only"
import { revalidatePath } from "next/cache"
import createSuperClient from "./supabase"
import { reservedSlugs } from "./constants"

type CreateCircleParams = {
  name: string
  slug: string
  nickname: string
  members?: string
  autoHideAfterGames?: number
  userId: string
}

export async function createCircleForUser({
  name,
  slug,
  nickname,
  members = "",
  autoHideAfterGames = 20,
  userId,
}: CreateCircleParams) {
  const supabase = createSuperClient()

  if (reservedSlugs.includes(slug)) throw new Error(`shmelo.io/${slug} is already taken`)

  const { data: existing } = await supabase.from("circles").select("*").eq("slug", slug).single()
  if (existing) throw new Error(`shmelo.io/${slug} is already taken`)

  const { data: circle, error } = await supabase
    .from("circles")
    .insert({ name, slug, auto_hide_after_games: autoHideAfterGames })
    .select()
    .single()

  if (error) throw new Error("failed to create circle")

  const { error: membersError } = await supabase
    .from("circle_members")
    .insert([
      {
        name: nickname,
        circle_id: circle.id,
        user_id: userId,
      },
      ...members
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean)
        .map((member) => ({
          name: member,
          circle_id: circle.id,
        })),
    ])
    .select()

  if (membersError) throw new Error("failed to add circle members")

  revalidatePath("/me")

  return circle
}
