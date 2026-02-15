import { getCircleBySlug, getCirclePlan, getCurrentUser, hasCurrentUserAccessToCircle } from "@/server/queries"
import { notFound } from "next/navigation"
import { DotGrid } from "../_components/dot-grid"
import Navigation from "./_components/navigation"
import { AccessProvider } from "./_context/access-context"
import { CirclePlanProvider } from "./_context/circle-plan-context"
import { AuthStateProvider } from "../_context/auth-context"

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ circle: string }>
}) {
  const { circle: circleSlug } = await params
  const circle = await getCircleBySlug(circleSlug)
  if (!circle) notFound()

  const user = await getCurrentUser()
  const [hasAccess, plan] = await Promise.all([
    hasCurrentUserAccessToCircle(circle.id),
    getCirclePlan(circle.id, user?.id),
  ])

  return (
    <AuthStateProvider isLoggedIn={!!user}>
      <AccessProvider circle={circle} hasAccess={hasAccess}>
        <CirclePlanProvider plan={plan}>
          <DotGrid className="flex min-h-screen flex-col">
            <Navigation circle={circle} />
            <div className="container mx-auto flex flex-1 max-w-3xl flex-col px-4 pb-12">
              <div className="min-h-8 flex-1"></div>

              <div className="flex-1">{children}</div>
              <div className="min-h-8 flex-1"></div>
            </div>
            <p className="py-4 text-center text-xs text-muted-foreground sm:hidden">
              Rotate your device to see the bump chart
            </p>
          </DotGrid>
        </CirclePlanProvider>
      </AccessProvider>
    </AuthStateProvider>
  )
}
