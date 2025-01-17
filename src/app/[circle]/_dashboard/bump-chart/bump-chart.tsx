import { curveMonotoneX, line } from "d3-shape"
import { BumpChartProvider, useChart } from "./bump-chart-context"
import { GameRecord } from "./types"
import { cn } from "@/lib/utils"

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
  return (
    <>
      <MemberLine memberId={memberId} className="stroke-accent stroke-2" />
      <MemberDots memberId={memberId} />
    </>
  )
}

function MemberLines() {
  const { gamesByMember } = useChart()

  return (
    <>
      {Array.from(gamesByMember.entries()).map(([memberId]) => (
        <MemberLine key={memberId} memberId={memberId} />
      ))}
    </>
  )
}

type MemberLineProps = {
  memberId: number
  className?: string
}

function MemberLine({ memberId, className }: MemberLineProps) {
  const { gamesByMember, xScale, yScale, data } = useChart()
  const myGames = gamesByMember.get(memberId) || []
  const totalGames = data.length

  const lineGenerator = line<GameRecord>()
    .x((_, i) => xScale(totalGames - i))
    .y((d) => yScale(d.rank))
    .curve(curveMonotoneX)

  return (
    <path
      d={lineGenerator(myGames) || ""}
      fill="none"
      className={cn("stroke-secondary stroke-1", className)}
      data-m={memberId}
    />
  )
}

function MemberDots({ memberId }: { memberId: number }) {
  const { gamesByMember } = useChart()
  const myGames = gamesByMember.get(memberId) || []
  return myGames.map((game, index) => <Dot key={index} gameIndex={index} rank={game.rank} />)
}

type DotProps = {
  gameIndex: number
  rank: number
  className?: string
}

function Dot({ gameIndex, rank, className }: DotProps) {
  const { data, xScale, yScale } = useChart()

  const totalGames = data.length
  return (
    <circle
      cx={xScale(totalGames - gameIndex)}
      cy={yScale(rank)}
      r={3}
      className={cn("fill-accent stroke-accent", className)}
    />
  )
}
