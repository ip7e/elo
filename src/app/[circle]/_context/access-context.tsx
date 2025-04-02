"use client"

import { createBrowserClient } from "@/utils/supabase/client"
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { Circle } from "../../../server/types"

type AccessContextType = {
  circle: Circle
  hasAccess: boolean
}

const AccessContext = createContext<AccessContextType | null>(null)

export const AccessProvider = ({
  circle,
  hasAccess: defaultHasAccess,
  children,
}: PropsWithChildren<AccessContextType>) => {
  const [hasAccess, setHasAccess] = useState<boolean>(defaultHasAccess)

  useEffect(() => {
    const supabase = createBrowserClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((e, session) => {
      //check if user is a member of the circle
      supabase
        .from("circle_members")
        .select("*")
        .eq("user_id", session?.user?.id)
        .single()
        .then(({ data }) => setHasAccess(!!data))
    })

    return subscription.unsubscribe()
  }, [])

  return <AccessContext.Provider value={{ circle, hasAccess }}>{children}</AccessContext.Provider>
}

export const useHasAccess = () => {
  const context = useContext(AccessContext)
  if (!context) return { hasAccess: false, circle: null }
  return context
}
