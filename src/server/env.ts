import { z } from "zod"

const schema = z.object({
  // public (available client + server, inlined at build)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // server-only
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  const missing = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`)
  throw new Error(`Missing or invalid environment variables:\n${missing.join("\n")}`)
}

export const env = parsed.data
