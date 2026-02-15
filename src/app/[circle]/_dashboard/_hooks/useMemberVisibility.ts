import { useState, useMemo } from "react"
import { MemberStats } from "@/server/types"

/**
 * Hook to manage member visibility state and filtering logic.
 * Handles both manual visibility toggles and tracking newly added members.
 */
export function useMemberVisibility(memberStats: MemberStats[], pendingMemberIds: number[] = []) {
  const [showHidden, setShowHidden] = useState(false)
  const [newlyAddedMemberIds, setNewlyAddedMemberIds] = useState<Set<number>>(new Set())

  const visibleMemberStats = useMemo(
    () =>
      showHidden
        ? memberStats
        : memberStats.filter((m) => m.isVisible || newlyAddedMemberIds.has(m.id) || pendingMemberIds.includes(m.id)),
    [memberStats, showHidden, newlyAddedMemberIds, pendingMemberIds],
  )

  const hasHiddenMembers = memberStats.some((m) => !m.isVisible && !newlyAddedMemberIds.has(m.id))

  const toggleShowHidden = () => setShowHidden((prev) => !prev)

  const addNewlyAddedMember = (id: number) => {
    setNewlyAddedMemberIds((prev) => new Set(prev).add(id))
  }

  return {
    showHidden,
    visibleMemberStats,
    hasHiddenMembers,
    toggleShowHidden,
    addNewlyAddedMember,
    newlyAddedMemberIds,
  }
}
