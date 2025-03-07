import { MembersWithStats } from "@/server/queries"
import { cn } from "@/utils/tailwind/cn"
import { GameResult, GameWithResults } from "../../../server/types"
import { LeadingCell, MiddleCell, Table, TableRow, TrailingCell } from "./_components/table"
import NumbersShuffler from "../_components/numbers-shuffler"

type Props = {
  membersWithStats: MembersWithStats
  recentGames: GameWithResults[]
  selectedGameIndex: number
}

export function SpotlightMembers({ membersWithStats, recentGames, selectedGameIndex }: Props) {
  const selectedGame = recentGames[selectedGameIndex]

  const sortedMembers = membersWithStats

  const selectedGameByMember = selectedGame?.game_results.reduce(
    (acc, r) => {
      acc[r.member_id] = r
      return acc
    },
    {} as Record<number, GameResult>,
  )

  return (
    <div className="relative">
      <Table className="relative">
        <>
          {/* selected game date as a headline */}
          <div className="border-1 absolute -top-8 left-1/2 -translate-x-1/2 select-none rounded-md border border-muted px-2 py-1 text-sm text-muted-foreground">
            {new Date(selectedGame?.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </div>
          {sortedMembers.map((member, i) => {
            const gameResult = selectedGameByMember[member.id]
            const participated = !!gameResult
            const eloDiff = gameResult ? gameResult.elo - (gameResult.previous_elo || 1100) : 0

            return (
              <TableRow
                key={`${member.id}-${selectedGameIndex}`}
                layout={false}
                exit={undefined}
                animate={undefined}
                initial={undefined}
                transition={undefined}
              >
                <LeadingCell className="invisible">{i + 1}</LeadingCell>
                <MiddleCell className={cn(participated ? "text-primary" : "text-muted")}>
                  {member.name}
                </MiddleCell>
                <TrailingCell>
                  {participated && (
                    <span
                      className={cn(
                        eloDiff > 0 && "text-green-500",
                        eloDiff < 0 && "text-red-500",
                        "font-mono",
                      )}
                    >
                      {eloDiff > 0 ? "+" : ""}
                      <NumbersShuffler value={eloDiff} spin={false} />
                    </span>
                  )}
                </TrailingCell>
              </TableRow>
            )
          })}
        </>
      </Table>
    </div>
  )
}
