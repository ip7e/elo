"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Database } from "@/types/supabase"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState } from "react"

const isDev = process.env.NODE_ENV === "development"

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>()
  const [email, setEmail] = useState<string | null>(null)

  const [isSent, setIsSent] = useState(false)
  const redirectTo = isDev
    ? "http://localhost:3000/auth/callback"
    : "https://www.shmelo.io/auth/callback"

  const isValidEmail = email && /^\S+@\S+\.\S+$/.test(email.trim())

  if (isSent)
    return (
      <div className="flex w-full max-w-md flex-col gap-4 animate-in">
        <p>Check your email for the login link to continue</p>

        <p className="text-sm text-muted-foreground">you can close this window</p>
      </div>
    )
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (!isValidEmail) return
        await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: redirectTo,
          },
        })
        setIsSent(true)
      }}
    >
      <div className="flex w-full max-w-md flex-col gap-4">
        <Input placeholder="Email" className="w-full" onChange={(e) => setEmail(e.target.value)} />
        <Button variant="accent" disabled={!isValidEmail}>
          Send me Magic Link
        </Button>
      </div>
    </form>
  )
}
