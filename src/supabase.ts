import { createServer } from "http"
import { Database } from "./types/supabase"
import { createServerComponentClient as _createServerComponentClient } from "@supabase/auth-helpers-nextjs"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!url || !key) {
  throw new Error("Missing env variables for Supabase")
}
