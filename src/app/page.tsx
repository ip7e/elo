"use client"

import Hero from "./_components/hero/hero"

export default function Example() {
  return (
    <div className="bg-bg">
      <div className="relative isolate min-h-[calc(100vh-2rem)] px-6 pt-14 lg:px-8">
        <Hero />
      </div>
      <footer className="text-center text-xs text-primary/30">
        <p>
          created by{" "}
          <a href="https://ika.im" className="underline hover:text-primary/80">
            Ika
          </a>{" "}
          <span className="mx-1">•</span>
          <a href="https://x.com/itsikap" className="underline hover:text-primary/80">
            x
          </a>{" "}
          <a href="https://bsky.app/profile/ika.im" className="underline hover:text-primary/80">
            bluesky
          </a>
        </p>
      </footer>
    </div>
  )
}
