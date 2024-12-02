"use client"

import { PropsWithChildren } from "react"
import { useAuthState } from "../_context/auth-context"

export default function LoggedOut({ children }: PropsWithChildren) {
  const { isLoggedIn } = useAuthState()
  if (!isLoggedIn) return <>{children}</>
}
