"use client"

import { CirclePlan } from "@/server/types"
import { createContext, PropsWithChildren, useContext } from "react"

const CirclePlanContext = createContext<CirclePlan | null>(null)

export const CirclePlanProvider = ({ plan, children }: PropsWithChildren<{ plan: CirclePlan }>) => {
  return <CirclePlanContext.Provider value={plan}>{children}</CirclePlanContext.Provider>
}

export const useCirclePlan = () => {
  const context = useContext(CirclePlanContext)
  if (!context) throw new Error("useCirclePlan must be used within CirclePlanProvider")
  return context
}
