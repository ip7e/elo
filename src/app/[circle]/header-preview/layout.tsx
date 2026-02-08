import { getCircleBySlug, getCirclePlan, getCurrentUser, hasCurrentUserAccessToCircle } from "@/server/queries"
import { notFound } from "next/navigation"
import { AccessProvider } from "../_context/access-context"
import { CirclePlanProvider } from "../_context/circle-plan-context"
import { AuthStateProvider } from "../../_context/auth-context"

// This layout omits the default Navigation so we can preview variants
export default async function HeaderPreviewLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ circle: string }>
}) {
  const { circle: circleSlug } = await params
  const circle = await getCircleBySlug(circleSlug)
  if (!circle) notFound()

  const [user, hasAccess, plan] = await Promise.all([
    getCurrentUser(),
    hasCurrentUserAccessToCircle(circle.id),
    getCirclePlan(circle.id),
  ])

  return (
    <AuthStateProvider isLoggedIn={!!user}>
      <AccessProvider circle={circle} hasAccess={hasAccess}>
        <CirclePlanProvider plan={plan}>
          {children}
        </CirclePlanProvider>
      </AccessProvider>
    </AuthStateProvider>
  )
}
