"use client"

import { PropsWithChildren } from "react"
import { useCirclePlan } from "../_context/circle-plan-context"

function Trial({ children }: PropsWithChildren) {
  const { status } = useCirclePlan()
  return status === "trial" ? <>{children}</> : null
}

function Locked({ children }: PropsWithChildren) {
  const { status } = useCirclePlan()
  return status === "locked" ? <>{children}</> : null
}

function Pro({ children }: PropsWithChildren) {
  const { status } = useCirclePlan()
  return status === "pro" ? <>{children}</> : null
}

function Active({ children }: PropsWithChildren) {
  const { status } = useCirclePlan()
  return status !== "locked" ? <>{children}</> : null
}

export const Plan = { Trial, Locked, Pro, Active }
