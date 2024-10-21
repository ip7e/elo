import { getCircleBySlug, hasCurrentUserAccessToCircle } from "@/server/queries"
import { Suspense } from "react"
import Navigation from "./_components/navigation"
import { AccessProvider } from "./_context/access-context"

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
      <Navigation circle={circle} />
      <div className="container mx-auto flex h-full max-w-3xl flex-col px-4">
        <div className="min-h-28 flex-1"></div>

        <div className="flex-[3]">
          <Suspense
            fallback={
              <div className="flex h-3/4 w-full flex-col justify-center text-center font-mono text-neutral-300">
                loading...
              </div>
            }
          >
            {children}
          </Suspense>
        </div>
      </div>
    </AccessProvider>
  )
}
