"use client"

import { createBrowserClient } from "@/utils/supabase/client"
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { Circle } from "../types"

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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((e, session) => {
      setHasAccess(!!session?.user?.id)
    })

    supabase.auth.getSession().then(({ data }) => {
      setIsLoading(false)
      setHasAccess(!!data.session?.user.id)
    })

    return subscription.unsubscribe()
  }, [])

  return <AccessContext.Provider value={{ circle, hasAccess }}>{children}</AccessContext.Provider>
}

export const useHasAccess = () => {
  const context = useContext(AccessContext)
  if (!context) throw new Error("useHasAccess must be used within a AccessProvider")
  return context
}
