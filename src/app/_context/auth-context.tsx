"use client"

import { createBrowserClient } from "@/utils/supabase/client"
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"

type AuthStateContextType = {
  isLoggedIn: boolean
}

const AuthStateContext = createContext<AuthStateContextType | null>(null)

export const AuthStateProvider = ({
  isLoggedIn: defaultIsLoggedIn,
  children,
}: PropsWithChildren<AuthStateContextType>) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(defaultIsLoggedIn)

  useEffect(() => {
    const supabase = createBrowserClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((e, session) => setIsLoggedIn(!!session))

    return subscription.unsubscribe()
  }, [])

  return <AuthStateContext.Provider value={{ isLoggedIn }}>{children}</AuthStateContext.Provider>
}

export const useAuthState = () => {
  const context = useContext(AuthStateContext)
  if (!context) throw new Error("useIsLoggedIn must be used within a AuthProvider")
  return context
}
