import { supabase } from "@/supabase"
import Navigation from "./navigation"

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

  if (!circle) return null

  return (
    <>
      <div className="container max-w-lg mx-auto h-full flex flex-col">
        <div className="mx-auto mt-5 w-full flex items-center justify-center">
          <Navigation circle={circle} />
        </div>
        <div className="flex-1">{children}</div>
        <div className="flex-1 max-h-28 "></div>
      </div>
    </>
  )
}
