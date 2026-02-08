"use client"

import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Circle } from "@/server/types"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ArrowUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type Props = {
  onCreated?: (circle: Circle) => void
}

const transport = new DefaultChatTransport({ api: "/api/chat/create-circle" })

export default function CreateCircleChat({ onCreated }: Props) {
  const [createdCircle, setCreatedCircle] = useState<Circle | null>(null)
  const [givenUp, setGivenUp] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport,
    messages: [
      {
        id: "greeting",
        role: "assistant",
        parts: [{ type: "text", text: "Hey! What game do you and your friends play?" }],
      },
    ],
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    for (const message of messages) {
      for (const part of message.parts) {
        // eslint-disable-next-line
        const p = part as any
        if (p.type === "tool-createCircle" && p.state === "output-available" && p.output?.success) {
          setCreatedCircle(p.output.circle)
          onCreated?.(p.output.circle)
        }
        if (p.type === "tool-giveUp" && p.state === "output-available") {
          setGivenUp(true)
        }
      }
    }
  }, [messages, onCreated])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isLoading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <DialogContent className="flex max-h-[80vh] flex-col outline-none">
      <DialogHeader>
        <DialogTitle>Create new Circle</DialogTitle>
      </DialogHeader>

      <div ref={scrollRef} className="flex min-h-[200px] max-h-[50vh] flex-1 flex-col gap-3 overflow-y-auto py-4">
        {messages.map((message) => {
          const textParts = message.parts.filter(
            (p): p is { type: "text"; text: string } => p.type === "text",
          )
          if (!textParts.length) return null
          const text = textParts.map((p) => p.text).join("")
          if (!text) return null

          const isUser = (message.role as string) === "user"
          return (
            <div
              key={message.id}
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                isUser
                  ? "self-end bg-accent text-accent-foreground"
                  : "self-start bg-muted text-muted-foreground",
              )}
            >
              {text}
            </div>
          )
        })}
        {isLoading && (
          <div className="self-start rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
            <span className="animate-pulse">...</span>
          </div>
        )}
      </div>

      {givenUp && !isLoading ? (
        <DialogClose asChild>
          <Button variant="ghost" className="w-full">
            Fair enough, bye
          </Button>
        </DialogClose>
      ) : createdCircle && !isLoading ? (
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button variant="ghost" className="flex-1">
              Close
            </Button>
          </DialogClose>
          <Link href={createdCircle.slug} className="flex-1">
            <Button variant="accent" className="w-full">
              Open {createdCircle.name}
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            autoFocus
          />
          <Button type="submit" size="icon" variant="accent" disabled={isLoading || !input.trim()}>
            <ArrowUp size={16} />
          </Button>
        </form>
      )}
    </DialogContent>
  )
}
