import { Polar } from "@polar-sh/sdk"
import { NextRequest, NextResponse } from "next/server"
import createSuperClient from "@/server/supabase"

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
})

export async function GET(req: NextRequest) {
  const circleId = req.nextUrl.searchParams.get("circleId")
  if (!circleId) {
    return NextResponse.json({ error: "Missing circleId" }, { status: 400 })
  }

  const supabase = createSuperClient()
  const { data: circle } = await supabase
    .from("circles")
    .select("slug")
    .eq("id", +circleId)
    .single()

  if (!circle) {
    return NextResponse.json({ error: "Circle not found" }, { status: 404 })
  }

  const origin = req.nextUrl.origin
  const successUrl = `${origin}/${circle.slug}?unlocked=true`

  const checkout = await polar.checkouts.create({
    products: [process.env.POLAR_PRODUCT_ID!],
    metadata: { circleId: +circleId },
    successUrl,
  })

  return NextResponse.redirect(checkout.url)
}
