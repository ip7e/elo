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
import { useEffect, useMemo, useRef, useState } from "react"

type Props = {
  isFirstCircle?: boolean
  lastNickname?: string
  onCreated?: (circle: Circle) => void
}

export default function CreateCircleChat({ isFirstCircle, lastNickname, onCreated }: Props) {
  const [createdCircle, setCreatedCircle] = useState<Circle | null>(null)
  const [givenUp, setGivenUp] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState("")

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat/create-circle",
        body: { isFirstCircle, lastNickname },
      }),
    [isFirstCircle, lastNickname],
  )

  const { messages, sendMessage, status } = useChat({
    transport,
    messages: [
      {
        id: "greeting",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: isFirstCircle
              ? "Hey! Lets set up your first scoreboard. What game is it for?"
              : "What's this one for?",
          },
        ],
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
                "max-w-[85%]",
                isUser
                  ? "self-end rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground"
                  : "self-start text-base text-muted-foreground",
              )}
            >
              {isUser
                ? text
                : text.split(/(shmelo\.io\/[\w-]+)/g).map((segment, i) =>
                    /^shmelo\.io\/[\w-]+$/.test(segment) ? (
                      <span
                        key={i}
                        className="inline-block rounded border bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
                      >
                        {segment}
                      </span>
                    ) : (
                      segment
                    ),
                  )}
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
