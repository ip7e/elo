import { createServerClientWithCookies } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const supabase = await createServerClientWithCookies()
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL("/me", req.url))
}
