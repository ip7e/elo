import { getCircleBySlug } from "@/server/queries"
import { notFound } from "next/navigation"
import NavigationVariantsPreview from "../_components/navigation-variants"

export default async function HeaderPreviewPage({
  params,
}: {
  params: Promise<{ circle: string }>
}) {
  const { circle: circleSlug } = await params
  const circle = await getCircleBySlug(circleSlug)

  if (!circle) return notFound()

  return <NavigationVariantsPreview circle={circle} />
}
