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
      <div className="mx-auto flex justify-center">
        <Navigation circle={circle} />
      </div>
      <div className="container max-w-lg mx-auto">{children}</div>
    </>
  )
}
