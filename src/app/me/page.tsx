import { getMyCircles } from "@/server/queries"
import MyCircles from "./my-circles"
import { useServerAction } from "zsa-react"
import { TestAdminProcedure } from "@/server/actions"

export default async function Page() {
  const [circles, error] = await getMyCircles()
  if (!circles) return

  return <MyCircles circles={circles}></MyCircles>
}
