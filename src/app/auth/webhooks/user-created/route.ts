import { resolveInvitation, upsertUserProfile } from "@/server/admin"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const user = await req.json()

  const { id: user_id, email } = user.record

  if (!user_id || !email) return NextResponse.json({ error: "Failed to get user" })

  const [, profileError] = await upsertUserProfile({ email, userId: user_id })

  if (profileError) return NextResponse.json({ error: "Failed to add user to profiles" })

  await resolveInvitation({ email })

  return NextResponse.json({ success: true })
}
