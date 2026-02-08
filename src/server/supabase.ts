import "server-only"
import { Database } from "@/types/supabase"
import { createClient } from "@supabase/supabase-js"
import { env } from "./env"

export default function createSuperClient() {
  const supabase = createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  )

  return supabase
}
