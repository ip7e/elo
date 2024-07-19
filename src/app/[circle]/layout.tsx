import { createServerClient } from "@/utils/supabase/server"
import Navigation from "./navigation/navigation"

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { circle: string }
}) {
  const supabase = createServerClient()
  const { data: circle, error } = await supabase
    .from("circles")
    .select("*")
    .eq("slug", params.circle)
    .single()

  if (!circle) return null

  return (
    <>
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        <div className="mx-auto mt-5 flex w-full items-center justify-center">
          <Navigation circle={circle} />
        </div>

        <div className="flex-1">{children}</div>
        <div className="max-h-28 flex-1"></div>
      </div>
    </>
  )
}
