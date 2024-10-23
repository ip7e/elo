import { getCircleBySlug, hasCurrentUserAccessToCircle } from "@/server/queries"
import { notFound } from "next/navigation"
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
  if (!circle) notFound()

  const hasAccess = await hasCurrentUserAccessToCircle(circle.id)

  return (
    <AccessProvider circle={circle} hasAccess={hasAccess}>
      <Navigation circle={circle} />
      <div className="container mx-auto flex h-full max-w-3xl flex-col px-4">
        <div className="min-h-28 flex-1"></div>

        <div className="flex-[3]">{children}</div>
      </div>
    </AccessProvider>
  )
}
