"use-client"

import { createBrowserClient } from "@/utils/supabase/client"
import { PropsWithChildren, ReactNode, useEffect, useState } from "react"

type Props = PropsWithChildren<{
  loadingCallback?: ReactNode
  noAccessCallback?: ReactNode
  noAuthCallback?: ReactNode
}>

export default function AccessGuard({
  children,
  noAccessCallback,
  loadingCallback,
  noAuthCallback,
}: Props) {
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((e, session) => {
      setUserId(session?.user?.id ?? null)
    })

    supabase.auth.getSession().then(({ data }) => {
      setIsLoading(false)
      setUserId(data.session?.user?.id ?? null)
    })

    return subscription.unsubscribe()
  }, [])

  if (isLoading) return <>{loadingCallback}</>

  if (userId) return <>{children}</>
  if (!userId) return <>{noAuthCallback}</>
}
