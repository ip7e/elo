import { getCircleBySlug, getCurrentUser, hasCurrentUserAccessToCircle } from "@/server/queries"
import { notFound } from "next/navigation"
import Navigation from "./_components/navigation"
import { AccessProvider } from "./_context/access-context"
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
  const hasAccess = await hasCurrentUserAccessToCircle(circle.id)

  return (
    <AuthStateProvider isLoggedIn={!!user}>
      <AccessProvider circle={circle} hasAccess={hasAccess}>
        <Navigation circle={circle} />
        <div className="container mx-auto flex h-full max-w-3xl flex-col px-4">
          <div className="min-h-28 flex-1"></div>

          <div className="flex-[3]">{children}</div>
        </div>
      </AccessProvider>
    </AuthStateProvider>
  )
}
