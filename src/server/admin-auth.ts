import "server-only"
import { createServerActionProcedure } from "zsa"
import { authedProcedure } from "./procedures"

export function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return adminEmails.includes(email.toLowerCase())
}

export const adminProcedure = createServerActionProcedure(authedProcedure).handler(async ({ ctx }) => {
  if (!isAdmin(ctx.user.email)) {
    throw new Error("Unauthorized")
  }
  return { user: ctx.user }
})
