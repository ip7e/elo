import { useState } from "react"
import { MembersTable, MemberRowData } from "./members-table"

const DEMO_MEMBERS: MemberRowData[] = [
  { id: 1, name: "Alice", rank: 1, elo: 1200, winningStreak: 3 },
  { id: 2, name: "Bob", rank: 2, elo: 1150 },
  { id: 3, name: "Charlie", rank: 3, elo: 1100, winningStreak: 1 },
  { id: 4, name: "David", rank: 4, elo: 1050 },
  { id: 5, isNew: true, name: "Eve" },
]

export function DemoMembers() {
  const [highlightId, setHighlightId] = useState<number>(0)

  return (
    <MembersTable
      members={DEMO_MEMBERS}
      highlightId={highlightId}
      onHighlightChange={setHighlightId}
    />
  )
}
