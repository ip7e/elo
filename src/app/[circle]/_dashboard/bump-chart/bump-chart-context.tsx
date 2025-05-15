import { createContext, useContext, useMemo } from "react"
import { ScaleLinear, scaleLinear } from "d3-scale"
import { GameRecord } from "./types"

type ChartContextType = {
  data: GameRecord[][]
  width: number
  height: number
  xScale: ScaleLinear<number, number>
  yScale: ScaleLinear<number, number>
  maxRank: number
  gamesByMember: Map<number, GameRecord[]>
}

const ChartContext = createContext<ChartContextType | null>(null)

export function BumpChartProvider({
  children,
  data,
  width,
  height,
  padding,
  itemWidth,
  itemHeight,
}: {
  children: React.ReactNode
  data: GameRecord[][]
  width: number
  height: number
  padding: number
  itemWidth: number
  itemHeight: number
}) {
  const maxRank = useMemo(() => data[0].length, [data])

  const gamesByMember = useMemo(() => {
    const map = new Map<number, GameRecord[]>()
    data.map((gameRecords) => {
      gameRecords.map((record) => {
        const memberId = record.member.id
        const currentGames = map.get(memberId) || []
        map.set(memberId, [...currentGames, record])
      })
    })
    return map
  }, [data])

  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, data.length])
        .range([16, width - 16]),
    [data.length, width],
  )

  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain([0, maxRank])
        // make line to start at the middle of the lane
        // TODO: make this dynamic
        .range([padding + 15, height - padding + 15]),
    [maxRank, height, padding],
  )

  const value = {
    data,
    width,
    height,
    xScale,
    yScale,
    maxRank,
    gamesByMember,
  }

  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
}

export function useChart() {
  const context = useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a BumpChartProvider")
  }
  return context
}
