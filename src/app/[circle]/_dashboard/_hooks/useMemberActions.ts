import { useState } from "react"
import { useServerAction } from "zsa-react"
import { kickMember, setMemberVisibility } from "@/server/actions"
import { MemberStats } from "@/server/types"

/**
 * Hook to handle member actions (kick, visibility toggle).
 * Encapsulates server action logic and dialog state management.
 */
export function useMemberActions(member: MemberStats) {
  const [dialogContentType, setDialogContentType] = useState<"invite" | "rename" | null>(null)

  const { isPending: isKickPending, execute: executeKick } = useServerAction(kickMember)
  const { isPending: isVisibilityPending, execute: executeVisibility } =
    useServerAction(setMemberVisibility)

  const isAdmin = !!member.user_id
  const isNew = !member.latest_game
  const isHidden = member.visibility === "always_hidden"

  const handleToggleVisibility = async () => {
    await executeVisibility({
      id: member.id,
      circleId: member.circle_id,
      visibility: isHidden ? "auto" : "always_hidden",
    })
  }

  const handleKick = async () => {
    await executeKick({ id: member.id, circleId: member.circle_id })
  }

  return {
    dialogContentType,
    setDialogContentType,
    isKickPending,
    isVisibilityPending,
    isAdmin,
    isNew,
    isHidden,
    handleToggleVisibility,
    handleKick,
  }
}
