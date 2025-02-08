"use client"

import { BumpChart } from "./[circle]/_dashboard/bump-chart/bump-chart"
import Demo from "./_components/demo"
import Hero from "./_components/hero/hero"

export default function Example() {
  return (
    <div className="bg-bg">
      <div className="relative isolate min-h-[calc(100vh-2rem)] px-6 pt-14 lg:px-8">
        <Hero />

        {/* demo */}
        <Demo />
      </div>

      <footer className="mt-32 pb-4 text-center text-xs text-primary/30">
        <p>
          made by{" "}
          <a href="https://ika.im" className="underline hover:text-primary/80">
            Ika
          </a>{" "}
          <span className="mx-1">•</span>
          <a href="https://x.com/itsikap" className="underline hover:text-primary/80">
            x
          </a>
          {" | "}
          <a href="https://bsky.app/profile/ika.im" className="underline hover:text-primary/80">
            bluesky
          </a>
        </p>
      </footer>
    </div>
  )
}
