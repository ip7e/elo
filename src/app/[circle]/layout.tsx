import { getCircleBySlug, hasCurrentUserAccessToCircle } from "@/server/queries"
import { AccessProvider } from "./_context/access-context"
import Navigation from "./_components/navigation"

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { circle: string }
}) {
  const circle = await getCircleBySlug(params.circle)
  if (!circle) return null

  const hasAccess = await hasCurrentUserAccessToCircle(circle.id)

  return (
    <AccessProvider circle={circle} hasAccess={hasAccess}>
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        <div className="mx-auto mt-5 flex w-full items-center justify-center">
          <Navigation circle={circle} />
        </div>

        <div className="flex-1">{children}</div>
        <div className="max-h-28 flex-1"></div>
      </div>
    </AccessProvider>
  )
}
