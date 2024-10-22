import { getCurrentUser, getMyCircles } from "@/server/queries"
import MyCircles from "./my-circles"
import { redirect } from "next/navigation"

export default async function Page() {
  const user = await getCurrentUser()
  if (!user) redirect("/auth")

  const [circles, error] = await getMyCircles()
  if (!circles) return

  return <MyCircles circles={circles}></MyCircles>
}
