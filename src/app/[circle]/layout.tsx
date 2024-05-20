import { supabase } from "@/supabase"
import Navigation from "./navigation"
import useIsAdmin from "./use-is-admin"

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { circle: string }
}) {
  const { data: circle, error } = await supabase
    .from("circles")
    .select("*")
    .eq("slug", params.circle)
    .single()

  const isAdmin = await useIsAdmin(circle?.id)

  if (!circle) return null

  return (
    <>
      <div className="container max-w-3xl mx-auto h-full flex flex-col">
        <div className="mx-auto mt-5 w-full flex items-center justify-center">
          <Navigation circle={circle} isAdmin={isAdmin} />
        </div>

        <div className="flex-1">{children}</div>
        <div className="flex-1 max-h-28 "></div>
      </div>
    </>
  )
}
