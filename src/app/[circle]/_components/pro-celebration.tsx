"use client"

import { motion } from "framer-motion"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

const GOLD = "hsl(37 79% 49%)"
const GOLD_LIGHT = "hsl(37 90% 65%)"
const TOTAL_DURATION = 4.5
const DOT_SPACING = 12

type Particle = {
  id: number
  x: number
  y: number
  angle: number
  distance: number
  size: number
  delay: number
  duration: number
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360 + (Math.random() - 0.5) * 30
    const rad = (angle * Math.PI) / 180
    return {
      id: i,
      x: 50 + Math.cos(rad) * 10,
      y: 50 + Math.sin(rad) * 10,
      angle,
      distance: 60 + Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 0.3,
      duration: 0.9 + Math.random() * 0.8,
    }
  })
}

// Canvas-based dot grid wave that ripples outward from the card center.
// Portals into the DotGrid container so it shares the same stacking context
// and sits behind the z-10 card.
function DotWave({ cardRef }: { cardRef: React.RefObject<HTMLDivElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  // Find the DotGrid wrapper (closest relative parent with the dot background)
  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    // DotGrid renders as: <div class="relative overflow-x-hidden ...">
    const dotGrid = card.closest(".overflow-x-hidden")
    if (dotGrid) setContainer(dotGrid as HTMLElement)
  }, [cardRef])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const card = cardRef.current
    if (!canvas || !card || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const containerRect = container.getBoundingClientRect()
    const w = containerRect.width
    const h = containerRect.height

    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    const cardRect = card.getBoundingClientRect()
    const cx = cardRect.left - containerRect.left + cardRect.width / 2
    const cy = cardRect.top - containerRect.top + cardRect.height / 2

    const maxDist = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy))
    const waveDuration = 2800
    const waveWidth = 240
    const startTime = performance.now()

    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const goldR = isDark ? 160 : 201, goldG = isDark ? 120 : 147, goldB = isDark ? 50 : 48
    const lightR = isDark ? 180 : 230, lightG = isDark ? 145 : 180, lightB = isDark ? 60 : 70
    const maxAlpha = isDark ? 0.5 : 0.85

    function frame(now: number) {
      const elapsed = now - startTime
      if (elapsed > waveDuration + 800) return

      ctx!.clearRect(0, 0, w, h)

      const waveRadius = (elapsed / waveDuration) * maxDist

      for (let x = 0; x < w; x += DOT_SPACING) {
        for (let y = 0; y < h; y += DOT_SPACING) {
          const dist = Math.hypot(x - cx, y - cy)
          const distFromWave = Math.abs(dist - waveRadius)
          const effectiveWidth = Math.min(waveWidth, waveRadius)

          if (distFromWave > effectiveWidth) continue

          const intensity = 1 - distFromWave / effectiveWidth
          const eased = intensity * intensity * (3 - 2 * intensity)

          const leading = dist > waveRadius
          const r = leading ? lightR : goldR
          const g = leading ? lightG : goldG
          const b = leading ? lightB : goldB

          const alpha = eased * (elapsed < waveDuration ? maxAlpha : maxAlpha * (1 - (elapsed - waveDuration) / 800))

          ctx!.beginPath()
          ctx!.arc(x, y, 1 + eased * 0.8, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
          ctx!.fill()
        }
      }

      requestAnimationFrame(frame)
    }

    requestAnimationFrame(frame)
  }, [cardRef, container])

  useEffect(() => {
    if (container) animate()
  }, [container, animate])

  const canvas = (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      style={{ width: "100%", height: "100%" }}
    />
  )

  if (!container) return null
  return createPortal(canvas, container)
}

export function ProCelebration() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [playing, setPlaying] = useState(false)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const particles = useMemo(() => generateParticles(28), [])

  // Find the card element (parent of this component)
  const measuredRef = useCallback((node: HTMLDivElement | null) => {
    if (node) cardRef.current = node.closest("[data-dashboard-card]") as HTMLDivElement
  }, [])

  useEffect(() => {
    if (searchParams.get("unlocked") !== "true") return
    setPlaying(true)
    const params = new URLSearchParams(searchParams.toString())
    params.delete("unlocked")
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [searchParams, router, pathname])

  useEffect(() => {
    if (!playing) return
    const timeout = setTimeout(() => setPlaying(false), TOTAL_DURATION * 1000)
    return () => clearTimeout(timeout)
  }, [playing])

  if (!playing) return <div ref={measuredRef} className="hidden" />

  return (
    <>
      <div ref={measuredRef} className="hidden" />

      {/* Dot grid wave — ripples outward across the page background */}
      <DotWave cardRef={cardRef} />

      {/* Glow pulse — card shadow blooms gold */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-xl"
        initial={{ boxShadow: `0 0 0px 0px ${GOLD}00` }}
        animate={{
          boxShadow: [
            `0 0 0px 0px ${GOLD}00`,
            `0 0 30px 8px hsl(37 79% 49% / 0.35)`,
            `0 0 50px 15px hsl(37 79% 49% / 0.2)`,
            `0 0 20px 4px hsl(37 79% 49% / 0.08)`,
            `0 0 0px 0px ${GOLD}00`,
          ],
        }}
        transition={{ duration: 4, times: [0, 0.15, 0.35, 0.7, 1], ease: "easeOut" }}
      />

      {/* Flash — quick golden flash across the card */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 rounded-xl"
        style={{ background: `radial-gradient(ellipse at 50% 50%, hsl(37 90% 65% / 0.3), transparent 70%)` }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.05, 1.2] }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Particles — golden sparks burst outward from center */}
      <div className="pointer-events-none absolute inset-0 z-30">
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180
          const tx = Math.cos(rad) * p.distance
          const ty = Math.sin(rad) * p.distance
          return (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
                top: `${p.y}%`,
                background: `radial-gradient(circle, ${GOLD_LIGHT}, ${GOLD})`,
                boxShadow: `0 0 ${p.size * 2}px ${GOLD_LIGHT}`,
              }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [0, tx * 0.6, tx],
                y: [0, ty * 0.6, ty],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: p.duration,
                delay: 0.15 + p.delay,
                ease: "easeOut",
                times: [0, 0.2, 0.5, 1],
              }}
            />
          )
        })}
      </div>

      {/* Shimmer sweep */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: 3.5, times: [0, 0.5, 1] }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(105deg, transparent 25%, hsl(37 79% 49% / 0.12) 40%, hsl(37 90% 65% / 0.2) 48%, white/10 50%, hsl(37 90% 65% / 0.2) 52%, hsl(37 79% 49% / 0.12) 60%, transparent 75%)`,
          }}
          initial={{ x: "-120%" }}
          animate={{ x: "220%" }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </motion.div>
    </>
  )
}
