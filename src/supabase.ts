import { createClient } from "@supabase/supabase-js"
import { Database } from "./types/supabase"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!url || !key) {
  throw new Error("Missing env variables for Supabase")
}

export const supabase = createClient<Database>(url, key)
