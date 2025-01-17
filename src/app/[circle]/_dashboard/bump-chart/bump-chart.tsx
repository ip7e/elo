import { curveMonotoneX, line } from "d3-shape"
import { BumpChartProvider, useChart } from "./bump-chart-context"
import { GameRecord } from "./types"
import { cn } from "@/lib/utils"
import { motion, SVGMotionProps } from "framer-motion"
import { useEffect, useReducer } from "react"
import { useState } from "react"

type Props = {
  data: GameRecord[][]
  selectedMemberId: number
}

export function BumpChart({ data, selectedMemberId }: Props) {
  const itemWidth = 50
  const itemHeight = 32
  const padding = 0

  const width = data.length * itemWidth + padding * 2
  const height = data[0].length * itemHeight + padding * 2

  return (
    <BumpChartProvider
      data={data}
      width={width}
      height={height}
      padding={padding}
      itemWidth={itemWidth}
      itemHeight={itemHeight}
    >
      <div className="flex justify-end">
        <svg width={width} height={height}>
          <MemberLines />
          <WinningLineWithDots memberId={selectedMemberId} />
        </svg>
      </div>
    </BumpChartProvider>
  )
}

function WinningLineWithDots({ memberId }: { memberId: number }) {
  const { gamesByMember } = useChart()
  const myGames = gamesByMember.get(memberId) || []

  const [firstRender, renderedOnce] = useReducer(() => false, true)

  useEffect(renderedOnce, [memberId])

  const duration = firstRender ? myGames.length * 0.1 : 0

  return (
    <>
      <MemberLine
        key={`wining-line-${memberId}`}
        memberId={memberId}
        className="stroke-accent stroke-2"
        initial={{ opacity: 0, pathLength: firstRender ? 0 : 1 }}
        animate={{ opacity: 1, pathLength: 1 }}
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
              transition={{ duration: 0.2, delay: index * 0.01 + Math.min(duration, 1) }}
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

function MemberLines() {
  const { gamesByMember } = useChart()

  return (
    <>
      {Array.from(gamesByMember.entries()).map(([memberId, games]) => (
        <MemberLine
          key={memberId}
          memberId={memberId}
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 0.1 * games.length }}
        />
      ))}
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
      className={cn("stroke-secondary stroke-1", className)}
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
      {...props}
      cx={xScale(totalGames - gameIndex)}
      cy={yScale(rank)}
      r={3}
      className={cn("fill-accent stroke-accent", className)}
    />
  )
}
