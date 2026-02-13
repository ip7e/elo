import { cn } from "@/lib/utils"
import { curveMonotoneX, line } from "d3-shape"
import { AnimatePresence, motion, SVGMotionProps } from "framer-motion"
import { useEffect, useReducer, useRef, useState } from "react"
import { BumpChartProvider, useChart } from "./bump-chart-context"
import { ScrollContainer } from "./scroll-container"
import { GameRecord } from "./types"

type Props = {
  data: GameRecord[][]
  selectedMemberId: number
  className?: string
  selectedGameIndex: number | null
  onGameSelect?: (index: number | null) => void
}

export function BumpChart({
  data,
  selectedMemberId,
  selectedGameIndex,
  onGameSelect,
  className,
}: Props) {
  const itemWidth = 50
  const itemHeight = 32
  const padding = 8

  const [firstRender, renderedOnce] = useReducer(() => false, true)
  useEffect(renderedOnce, [renderedOnce])

  const dataWidth = data.length * itemWidth + padding * 2
  const height = data[0].length * itemHeight + padding * 2

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const svgWidth = Math.max(dataWidth, containerWidth ?? dataWidth)

  const isGameSelected = selectedGameIndex !== null

  const enableGameSelect = onGameSelect !== undefined

  return (
    <ScrollContainer
      ref={containerRef}
      className={cn(
        "",
        `relative flex min-h-16 w-full flex-1 flex-row-reverse items-start`,
        className,
      )}
    >
      {containerWidth === null ? null : <BumpChartProvider
        data={data}
        width={dataWidth}
        svgWidth={svgWidth}
        height={height}
        padding={padding}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
      >
        <div className="block">
          <svg width={svgWidth} height={height} className="">
            <EmptyDots />

            <MemberLines selectedGameIndex={selectedGameIndex} />

            <FirstGameDots />

            <WinningLineWithDots
              memberId={selectedMemberId}
              animate={firstRender}
              selectedGameIndex={selectedGameIndex}
            />

            {isGameSelected && (
              <SelectedGameOverlayLines
                gameIndex={selectedGameIndex}
                highlightedMemberId={selectedMemberId}
              />
            )}

            {isGameSelected && (
              <GameSessionSpotlight
                gameIndex={selectedGameIndex}
                highlightedMemberId={selectedMemberId}
              />
            )}

            {enableGameSelect && <HoverCols onSelect={onGameSelect} />}
          </svg>
        </div>
      </BumpChartProvider>}
    </ScrollContainer>
  )
}

function WinningLineWithDots({
  memberId,
  animate,
  selectedGameIndex,
}: {
  memberId: number
  animate: boolean
  selectedGameIndex: number | null
}) {
  const { gamesByMember } = useChart()
  const myGames = gamesByMember.get(memberId) || []
  const duration = animate ? myGames.length * 0.1 : 0

  return (
    <>
      <MemberLine
        key={`wining-line-${memberId}`}
        memberId={memberId}
        selectedGameIndex={selectedGameIndex}
        className="stroke-accent stroke-2"
        initial={{ opacity: 0, pathLength: animate ? 0 : 1 }}
        animate={{ opacity: [0, 1, 1], pathLength: 1 }}
        transition={{ duration }}
      />
      {myGames.map(
        (game, index) =>
          game.played && (
            <Dot
              key={`winning-dot-${memberId}-${game.id}`}
              gameIndex={index}
              rank={game.rank}
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.005 + Math.min(duration, 1) }}
              className={cn(
                "fill-background stroke-accent stroke-2",
                game.won ? "fill-accent" : "",
              )}
            />
          ),
      )}
    </>
  )
}

type MemberLinesProps = {
  selectedGameIndex: number | null
}

function MemberLines({ selectedGameIndex }: MemberLinesProps) {
  const { gamesByMember } = useChart()

  return (
    <>
      {Array.from(gamesByMember.entries()).map(([memberId, games]) => (
        <MemberLine
          key={memberId}
          selectedGameIndex={selectedGameIndex}
          memberId={memberId}
          initial={{ opacity: 1, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.1 * games.length }}
          className={cn("pointer-events-none stroke-chart-line stroke-[1.5]")}
        />
      ))}
    </>
  )
}

function GameSessionSpotlight({
  gameIndex,
  highlightedMemberId,
}: {
  gameIndex: number
  highlightedMemberId: number
}) {
  const { data } = useChart()

  const selectedGameRecords = gameIndex !== null ? data[gameIndex] : null
  const participants = selectedGameRecords?.filter((record) => record.played)

  return (
    <>
      {participants &&
        participants.map((record) => {
          return (
            <Dot
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              key={`member-spotlight-dot-${record.member.id}-${gameIndex}`}
              gameIndex={gameIndex}
              rank={record.rank}
              r={3}
              className={cn(
                "fill-chart-line stroke-chart-line",
                highlightedMemberId === record.member.id && "fill-accent stroke-accent stroke-2",
                !record.won && "fill-background",
              )}
            />
          )
        })}
    </>
  )
}

function FirstGameDots() {
  const { gamesByMember } = useChart()

  return (
    <>
      {Array.from(gamesByMember.entries()).map(([memberId, games]) => {
        const firstGameIndex = games.findIndex((game) => game.isFirstGame)
        const firstGame = games[firstGameIndex]

        return (
          <Dot
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, delay: games.length * 0.1 }}
            key={memberId}
            gameIndex={firstGameIndex}
            rank={firstGame.rank}
            className={cn("fill-background stroke-chart-line")}
            r={2}
          />
        )
      })}
    </>
  )
}

const PATTERN_COUNT = 1


function EmptyDots() {
  const { xScale, yScale, data } = useChart()
  const totalGames = data.length
  const numPlayers = data[0].length
  const [pattern, setPattern] = useState(0)
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null)
  const gRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPattern((p) => (p + 1) % PATTERN_COUNT)
      if (e.key === "ArrowLeft") setPattern((p) => (p - 1 + PATTERN_COUNT) % PATTERN_COUNT)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    const svg = gRef.current?.closest("svg")
    if (!svg) return
    const onMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect()
      setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    const onLeave = () => setMouse(null)
    svg.addEventListener("mousemove", onMove)
    svg.addEventListener("mouseleave", onLeave)
    return () => {
      svg.removeEventListener("mousemove", onMove)
      svg.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  const dots: FillerDot[] = []

  // Within data range: fill bottom rows where players haven't joined yet
  for (let col = 0; col < totalGames; col++) {
    const playersAtTime = data[col].length
    if (playersAtTime >= numPlayers) continue

    const x = xScale(totalGames - col)
    for (let rank = playersAtTime; rank < numPlayers; rank++) {
      dots.push({ x, y: yScale(rank), col, rank, key: `empty-${col}-${rank}` })
    }
  }

  // Outside data range: dots at all rank positions
  for (let col = totalGames; ; col++) {
    const x = xScale(totalGames - col)
    if (x < 0) break
    for (let rank = 0; rank < numPlayers; rank++) {
      dots.push({ x, y: yScale(rank), col, rank, key: `empty-${col}-${rank}` })
    }
  }

  return (
    <g ref={gRef}>
      {fillerPatterns[pattern](dots, mouse)}
      <text x={8} y={14} className="fill-chart-line" fontSize={10} fontFamily="monospace">
        {pattern + 1}/{PATTERN_COUNT}
      </text>
    </g>
  )
}

type FillerDot = { x: number; y: number; col: number; rank: number; key: string }
type Mouse = { x: number; y: number } | null

const fillerPatterns: ((dots: FillerDot[], mouse: Mouse) => React.ReactNode)[] = [
  // Displacement crosses — pushed away from cursor, rotate based on distance
  (dots, mouse) =>
    dots.map((d) => {
      const s = 3
      if (!mouse) {
        return (
          <g key={d.key} opacity={0.5}>
            <line x1={d.x - s} y1={d.y} x2={d.x + s} y2={d.y} className="stroke-chart-line" strokeWidth={1} />
            <line x1={d.x} y1={d.y - s} x2={d.x} y2={d.y + s} className="stroke-chart-line" strokeWidth={1} />
          </g>
        )
      }
      const dx = d.x - mouse.x
      const dy = d.y - mouse.y
      const dist = Math.hypot(dx, dy) || 1
      const push = Math.max(0, 60 - dist) * 0.3
      const nx = d.x + (dx / dist) * push
      const ny = d.y + (dy / dist) * push
      const opacity = Math.min(0.6, dist / 250)
      const angle = dist * 0.8
      return (
        <g key={d.key} opacity={opacity} transform={`rotate(${angle} ${nx} ${ny})`}>
          <line x1={nx - s} y1={ny} x2={nx + s} y2={ny} className="stroke-chart-line" strokeWidth={1} />
          <line x1={nx} y1={ny - s} x2={nx} y2={ny + s} className="stroke-chart-line" strokeWidth={1} />
        </g>
      )
    }),
]

type MemberLineProps = {
  memberId: number
  selectedGameIndex: number | null
  className?: string
} & SVGMotionProps<SVGPathElement>

function MemberLine({ memberId, selectedGameIndex, className, ...props }: MemberLineProps) {
  const { gamesByMember, xScale, yScale, data } = useChart()
  const myGames = gamesByMember.get(memberId) || []
  const totalGames = data.length

  const lineGenerator = line<GameRecord>()
    .x((_, i) => xScale(totalGames - i))
    .y((d, i) => {
      if (selectedGameIndex && i <= selectedGameIndex && myGames[selectedGameIndex]) {
        const selectedGame = myGames[selectedGameIndex]
        return yScale(selectedGame.rank)
      } else {
        return yScale(d.rank)
      }
    })
    .curve(curveMonotoneX)

  return (
    <motion.path
      {...props}
      d={lineGenerator(myGames) || ""}
      fill="none"
      className={cn("pointer-events-none stroke-chart-line stroke-[1.5]", className)}
      data-m={memberId}
    />
  )
}

type DotProps = {
  gameIndex: number
  rank: number
  className?: string
} & SVGMotionProps<SVGCircleElement>

function Dot({ gameIndex, rank, className, ...props }: DotProps) {
  const { data, xScale, yScale } = useChart()

  const totalGames = data.length
  return (
    <motion.circle
      cx={xScale(totalGames - gameIndex)}
      cy={yScale(rank)}
      r={3}
      {...props}
      className={cn("pointer-events-none fill-accent stroke-accent", className)}
    />
  )
}

type HoverColsProps = {
  onSelect: (index: number | null) => void
}

function HoverCols({ onSelect }: HoverColsProps) {
  const { data, xScale, yScale } = useChart()

  const totalGames = data.length
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <>
      <AnimatePresence>
        {data.map((_, index) => (
          <g key={`hover-col-${index}`} className="group">
            <motion.rect
              key={index}
              x={xScale(totalGames - index) - 25}
              width={50}
              height="100%"
              className="group cursor-pointer fill-transparent"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onTouchStart={() => setHoveredIndex(index)}
              onTouchEnd={() => setHoveredIndex(null)}
              onClick={() => onSelect(index)}
            />
          </g>
        ))}

        {hoveredIndex !== null && (
          <motion.line
            key={`hover-line`}
            initial={{
              opacity: 0,
              x1: xScale(totalGames - hoveredIndex),
              x2: xScale(totalGames - hoveredIndex),
            }}
            animate={{
              opacity: 1,
              x1: xScale(totalGames - hoveredIndex),
              x2: xScale(totalGames - hoveredIndex),
            }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 1000, damping: 100, mass: 1 }}
            y1={yScale(0) - 12}
            y2={yScale(data[hoveredIndex].length - 1) + 12}
            className="pointer-events-none stroke-chart-line"
          />
        )}
      </AnimatePresence>
    </>
  )
}

function SelectedGameOverlayLines({
  gameIndex,
  highlightedMemberId,
}: {
  gameIndex: number
  highlightedMemberId: number
}) {
  const { data, xScale, yScale } = useChart()
  const totalGames = data.length
  const selectedGameRecords = data[gameIndex]
  const members = selectedGameRecords

  const width = gameIndex ? xScale(totalGames - 1) - xScale(totalGames - gameIndex - 1) + 20 : 0

  return (
    <g>
      <motion.rect
        initial={{
          x: xScale(totalGames),
          width,
          height: "100%",
        }}
        animate={{
          x: xScale(totalGames - gameIndex),
          width,
          height: "100%",
        }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none fill-background"
      ></motion.rect>

      {gameIndex !== null && (
        <line
          x1={xScale(totalGames - gameIndex)}
          x2={xScale(totalGames - gameIndex)}
          y1={yScale(-0.5)}
          y2={yScale(data[gameIndex].length - 0.5)}
          className="pointer-events-none stroke-chart-line stroke-1"
        ></line>
      )}

      {members.map((record) => {
        return (
          <line
            key={`member-spotlight-dot-${record.member.id}-${gameIndex}`}
            x1={xScale(totalGames - gameIndex)}
            x2={xScale(totalGames)}
            y1={yScale(record.rank)}
            y2={yScale(record.rank)}
            strokeDasharray={4}
            className={cn(
              "stroke-chart-line stroke-1",
              record.played && "stroke-chart-line",
              highlightedMemberId === record.member.id && "stroke-accent stroke-2",
            )}
          />
        )
      })}
    </g>
  )
}
