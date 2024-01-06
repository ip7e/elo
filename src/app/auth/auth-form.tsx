"use client"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/types/supabase"

const isDev = process.env.NODE_ENV === "development"

export default function AuthForm() {
  const supabase = createClientComponentClient<Database>()

  const redirectTo = isDev
    ? "http://localhost:3000/auth/callback"
    : "https://www.shmelo.io/auth/callback"

  return (
    <Auth
      supabaseClient={supabase}
      view="magic_link"
      appearance={{ theme: ThemeSupa }}
      theme="dark"
      showLinks={false}
      providers={[]}
      redirectTo={redirectTo}
    />
  )
}
