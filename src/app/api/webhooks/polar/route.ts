import { Webhooks } from "@polar-sh/nextjs"
import { env } from "@/server/env"
import createSuperClient from "@/server/supabase"

export const POST = Webhooks({
  webhookSecret: env.POLAR_WEBHOOK_SECRET,
  onOrderPaid: async (payload) => {
    const circleId = payload.data.metadata?.circleId
    console.log("[polar webhook] onOrderPaid", {
      orderId: payload.data.id,
      circleId,
    })
    if (!circleId) return

    const supabase = createSuperClient()
    const { error } = await supabase
      .from("circles")
      .update({
        is_unlocked: true,
        unlocked_at: new Date().toISOString(),
        polar_order_id: payload.data.id,
      })
      .eq("id", +circleId)

    if (error) {
      console.error("[polar webhook] failed to unlock circle", error)
    } else {
      console.log("[polar webhook] circle unlocked", { circleId })
    }
  },
})
