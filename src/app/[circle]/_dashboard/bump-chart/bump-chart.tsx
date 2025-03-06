import { curveMonotoneX, line } from "d3-shape"
import { BumpChartProvider, useChart } from "./bump-chart-context"
import { GameRecord } from "./types"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion, SVGMotionProps } from "framer-motion"
import { useEffect, useReducer } from "react"
import { useState } from "react"

type Props = {
  data: GameRecord[][]
  selectedMemberId: number
  className?: string
  selectedGameIndex?: number | null
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

  const width = data.length * itemWidth + padding * 2
  const height = data[0].length * itemHeight + padding * 2

  const isGameSelected = selectedGameIndex !== null && selectedGameIndex !== undefined

  const enableGameSelect = onGameSelect !== undefined

  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-100 dark:border-neutral-800",
        `relative flex min-h-16 w-full flex-1 items-start justify-end overflow-hidden`,
        className,
      )}
    >
      <BumpChartProvider
        data={data}
        width={width}
        height={height}
        padding={padding}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
      >
        <div className="flex justify-end">
          <svg width={width} height={height} className="">
            {isGameSelected && <SelectedGameColumn gameIndex={selectedGameIndex} />}

            {enableGameSelect && <HoverCols onSelect={onGameSelect} />}
            <MemberLines dim={isGameSelected} />

            {isGameSelected && <GameSessionSpotlight gameIndex={selectedGameIndex} />}
            <FirstGameDots />

            {!isGameSelected && (
              <WinningLineWithDots memberId={selectedMemberId} animate={firstRender} />
            )}
          </svg>
        </div>
      </BumpChartProvider>
    </div>
  )
}

function WinningLineWithDots({ memberId, animate }: { memberId: number; animate: boolean }) {
  const { gamesByMember } = useChart()
  const myGames = gamesByMember.get(memberId) || []

  const duration = animate ? myGames.length * 0.1 : 0

  return (
    <>
      <MemberLine
        key={`wining-line-${memberId}`}
        memberId={memberId}
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
  dim: boolean
}

function MemberLines({ dim }: MemberLinesProps) {
  const { gamesByMember } = useChart()

  return (
    <>
      {Array.from(gamesByMember.entries()).map(([memberId, games]) => (
        <MemberLine
          key={memberId}
          memberId={memberId}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: [0, 1, 1], pathLength: 1 }}
          transition={{ duration: 0.1 * games.length }}
          className={cn("pointer-events-none", dim && "stroke-neutral-200 dark:stroke-neutral-700")}
        />
      ))}
    </>
  )
}

function GameSessionSpotlight({ gameIndex }: { gameIndex: number }) {
  const { gamesByMember, data } = useChart()

  const selectedGameRecords = gameIndex !== null ? data[gameIndex] : null
  const participants = selectedGameRecords?.filter((record) => record.played)

  return (
    <>
      {participants &&
        participants.map((record) => {
          return (
            <MemberLine
              key={`member-line-spotlight-${record.member.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1] }}
              transition={{ duration: 0.1 * data.length }}
              memberId={record.member.id}
              className="stroke-primary stroke-1"
            />
          )
        })}
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
                "fill-background stroke-primary stroke-1",
                record.won ? "fill-primary" : "",
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
            className={cn("fill-background stroke-secondary")}
            r={2}
          />
        )
      })}
    </>
  )
}

type MemberLineProps = {
  memberId: number
  className?: string
} & SVGMotionProps<SVGPathElement>

function MemberLine({ memberId, className, ...props }: MemberLineProps) {
  const { gamesByMember, xScale, yScale, data } = useChart()
  const myGames = gamesByMember.get(memberId) || []
  const totalGames = data.length

  const lineGenerator = line<GameRecord>()
    .x((_, i) => xScale(totalGames - i))
    .y((d) => yScale(d.rank))
    .curve(curveMonotoneX)

  return (
    <motion.path
      {...props}
      d={lineGenerator(myGames) || ""}
      fill="none"
      className={cn("pointer-events-none stroke-secondary stroke-1", className)}
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

  const hoverGameRecords = hoveredIndex !== null ? data[hoveredIndex] : null

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
              onClick={() => onSelect(index)}
            />
          </g>
        ))}

        {hoveredIndex !== null && (
          <motion.line
            key={`hover-line`}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              x1: xScale(totalGames - hoveredIndex),
              x2: xScale(totalGames - hoveredIndex),
            }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 1000, damping: 100, mass: 1 }}
            y1={yScale(0) - 12}
            y2={yScale(data[hoveredIndex].length - 1) + 12}
            className="pointer-events-none stroke-secondary/30"
          />
        )}
      </AnimatePresence>

      {hoveredIndex !== null &&
        hoverGameRecords &&
        hoverGameRecords.map(
          (record) =>
            record.played && (
              <Dot
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, delay: hoveredIndex * 0.05 + 0.1 }}
                key={`hover-dot-${record.member.id}-${hoveredIndex}`}
                gameIndex={hoveredIndex}
                rank={record.rank}
                r={2}
                className="fill-muted stroke-muted"
              />
            ),
        )}
    </>
  )
}

function SelectedGameColumn({ gameIndex }: { gameIndex: number }) {
  const { data, xScale, yScale } = useChart()
  const totalGames = data.length

  return (
    <motion.rect
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      x={xScale(totalGames - gameIndex) - 15}
      width={30}
      height="100%"
      className="pointer-events-none fill-accent/5 stroke-accent/20"
    />
  )
}
