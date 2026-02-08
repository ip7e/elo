import { createServerClientWithCookies } from "@/utils/supabase/server"
import { createCircleForUser } from "@/server/circle-service"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText, tool, stepCountIs, UIMessage, convertToModelMessages } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
  const supabase = await createServerClientWithCookies()
  const { data } = await supabase.auth.getUser()
  if (!data.user) return new Response("Unauthorized", { status: 401 })

  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: `You are a friendly assistant helping the user create a new circle on shmelo.io — a casual Elo rating tracker for friend groups.

Your job is to collect three things:
1. Circle name (e.g. "Ping Pong Club", "Office Chess")
2. The user's nickname inside this circle (e.g. "Alex", "The Boss")
3. Other members to add (optional — they can always add more later)

Guidelines:
- Ask for the circle name first, then nickname, then members.
- If the user provides multiple pieces of info at once, accept them and skip ahead.
- Keep responses SHORT — one or two sentences max.
- When you have at least the name and nickname, call the createCircle tool.
- For members, the user can say "none", "skip", "no", "add later", etc. to skip.
- If the tool returns an error about the slug being taken, tell the user and ask for a different circle name.
- Do NOT ask about settings, links, or slugs — those are handled automatically.
- Be casual and friendly. No emojis.`,
    messages: await convertToModelMessages(messages),
    tools: {
      createCircle: tool({
        description: "Create a new circle with the collected information",
        inputSchema: z.object({
          name: z.string().describe("The circle name"),
          nickname: z.string().describe("The user's nickname in this circle"),
          members: z.string().optional().describe("Comma-separated list of other member names"),
        }),
        execute: async ({ name, nickname, members }) => {
          const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "")

          try {
            const circle = await createCircleForUser({
              name,
              slug,
              nickname,
              members,
              userId: data.user.id,
            })
            return { success: true, circle }
          } catch (e) {
            return {
              success: false,
              error: e instanceof Error ? e.message : "Failed to create circle",
            }
          }
        },
      }),
    },
    stopWhen: stepCountIs(2),
  })

  return result.toUIMessageStreamResponse()
}
