import { cn } from "@/lib/utils"
import { curveMonotoneX, line } from "d3-shape"
import { AnimatePresence, motion, SVGMotionProps } from "framer-motion"
import { useEffect, useReducer, useState } from "react"
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

  const width = data.length * itemWidth + padding * 2
  const height = data[0].length * itemHeight + padding * 2

  const isGameSelected = selectedGameIndex !== null

  const enableGameSelect = onGameSelect !== undefined

  return (
    <ScrollContainer
      className={cn(
        "",
        `relative flex min-h-16 w-full flex-1 flex-row-reverse items-start`,
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
        <div className="block">
          <svg width={width} height={height} className="">
            <MemberLines selectedGameIndex={selectedGameIndex} />

            {!isGameSelected && <FirstGameDots />}

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
      </BumpChartProvider>
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
          className={cn("pointer-events-none stroke-secondary stroke-1")}
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
                "fill-secondary stroke-secondary",
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
            className="pointer-events-none stroke-secondary/30"
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
          className="pointer-events-none stroke-secondary stroke-1"
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
              "stroke-muted stroke-1",
              record.played && "stroke-muted",
              highlightedMemberId === record.member.id && "stroke-accent stroke-2",
            )}
          />
        )
      })}
    </g>
  )
}
