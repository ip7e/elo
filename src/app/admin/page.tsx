import { isAdmin } from "@/server/admin-auth"
import { getAdminStats, getRecentCircles } from "@/server/admin-queries"
import { getCurrentUser } from "@/server/queries"
import { notFound, redirect } from "next/navigation"
import AdminDashboard from "./_components/admin-dashboard"

export default async function AdminPage() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth")
  if (!isAdmin(user.email)) notFound()

  const [stats, circles] = await Promise.all([getAdminStats(), getRecentCircles()])

  return <AdminDashboard stats={stats} circles={circles} />
}
