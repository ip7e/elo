import { Webhooks } from "@polar-sh/nextjs"
import createSuperClient from "@/server/supabase"

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onOrderPaid: async (payload) => {
    const circleId = payload.data.metadata?.circleId
    if (!circleId) return

    const supabase = createSuperClient()
    await supabase
      .from("circles")
      .update({
        is_unlocked: true,
        unlocked_at: new Date().toISOString(),
        polar_order_id: payload.data.id,
      })
      .eq("id", +circleId)
  },
})
