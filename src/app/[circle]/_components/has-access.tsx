"use client"

import { PropsWithChildren, ReactNode } from "react"
import { useHasAccess } from "../_context/access-context"

type Props = PropsWithChildren<{
  noAccessCallback?: ReactNode
  noAuthCallback?: ReactNode
}>

export default function HasAccess({ children, noAuthCallback }: Props) {
  const { hasAccess } = useHasAccess()
  if (hasAccess) return <>{children}</>
  if (!hasAccess) return <>{noAuthCallback}</>
}
