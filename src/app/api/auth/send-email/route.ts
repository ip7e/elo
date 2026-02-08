import { NextResponse } from "next/server"
import { Webhook } from "standardwebhooks"
import { resend } from "@/server/resend"
import { magicLinkEmail } from "@/server/emails/magic-link"

interface SendEmailPayload {
  user: {
    email: string
  }
  email_data: {
    token: string
    token_hash: string
    redirect_to: string
    email_action_type: "signup" | "magiclink" | "recovery" | "invite"
    site_url: string
    token_new: string
    token_hash_new: string
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

function buildVerifyUrl(payload: SendEmailPayload): string {
  const { token_hash, email_action_type, redirect_to } = payload.email_data

  const typeMap: Record<string, string> = {
    signup: "signup",
    magiclink: "magiclink",
    recovery: "recovery",
    invite: "invite",
  }

  const params = new URLSearchParams({
    token: token_hash,
    type: typeMap[email_action_type] ?? email_action_type,
    redirect_to: redirect_to || SUPABASE_URL,
  })

  return `${SUPABASE_URL}/auth/v1/verify?${params.toString()}`
}

function subjectForAction(action: string): string {
  switch (action) {
    case "signup":
      return "Confirm your email"
    case "recovery":
      return "Reset your password"
    case "invite":
      return "You've been invited"
    case "magiclink":
    default:
      return "Your sign-in link"
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()

    // Verify webhook signature — strip Supabase's "v1," prefix
    const secret = process.env.SEND_EMAIL_HOOK_SECRET!.replace(/^v1,/, "")
    const wh = new Webhook(secret)
    const headers = Object.fromEntries(request.headers.entries())
    wh.verify(rawBody, headers)

    const payload = JSON.parse(rawBody) as SendEmailPayload
    const { email } = payload.user
    const { email_action_type } = payload.email_data

    const verifyUrl = buildVerifyUrl(payload)
    const subject = subjectForAction(email_action_type)

    await resend.emails.send({
      from: "Shmelo <noreply@shmelo.io>",
      to: email,
      subject,
      html: magicLinkEmail(verifyUrl),
    })

    return NextResponse.json({})
  } catch (error) {
    console.error("send-email hook error:", error)
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    )
  }
}
