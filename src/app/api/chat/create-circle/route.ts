import { createServerClientWithCookies } from "@/utils/supabase/server"
import { createCircleForUser } from "@/server/circle-service"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText, tool, stepCountIs, UIMessage, convertToModelMessages } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
  const supabase = await createServerClientWithCookies()
  const { data } = await supabase.auth.getUser()
  if (!data.user) return new Response("Unauthorized", { status: 401 })

  const {
    messages,
    isFirstCircle,
    lastNickname,
  }: { messages: UIMessage[]; isFirstCircle?: boolean; lastNickname?: string } = await req.json()

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: `You help people set up a circle on shmelo.io — an Elo tracker for friend groups.

A "circle" is a group of friends tracking scores. It can be for one specific game or a mix of games — whatever they want. You need to figure out:
1. What they want to track (e.g. ping pong, chess, "board games", "everything", "mixed"). If they mention some random word, assume it's a name of the game, move to the next step but mention it that you made a guess its a game.
2. A short name for the link — suggest one based on the game + friend group, let them change it.${isFirstCircle ? " Mention that this link will be public at shmelo.io/<name>, so anyone can check scores without signing up — members don't need to register unless they want to be admins." : " The link will be at shmelo.io/<name>."}
3. Their display name — ask them to "pick your display name".${lastNickname ? ` They used "${lastNickname}" in another circle, so suggest that and let them confirm or change it.` : ""}
4. Other members to add (optional — they can add more later)

Rules:
- One short sentence per message. Max two if you really need to.
- Casual, like texting a friend. No emojis.
- If they give you multiple things at once, roll with it and skip ahead.
- After getting the nickname, ask who else is in the group. Keep it casual like "who else is playing?" Mention they can always add more later.
- Once you have game, link, nickname, and asked about members — call createCircle.
- If the slug is taken, tell them and suggest an alternative.
- If the user goes off-topic or asks unrelated questions, gently steer back once. Something like "haha not sure about that, but back to the circle — ..."
- If they keep going off-topic a second time, call the giveUp tool. Say something fun and short before calling it, like "alright I can tell you're not in the mood" or "okay you're clearly here to chat, not track scores" — be creative, keep it one sentence.
- Never explain what Elo is or how the app works. Just get the info and create.`,
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
      giveUp: tool({
        description: "Call this when the user keeps going off-topic after being redirected once",
        inputSchema: z.object({}),
        execute: async () => ({ givenUp: true }),
      }),
    },
    stopWhen: stepCountIs(2),
  })

  return result.toUIMessageStreamResponse()
}
