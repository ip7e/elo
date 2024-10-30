import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { CircleWithMyRank } from "@/server/queries"
import { EllipsisVertical } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Card } from "./cards"
import DeleteCircleDialogContent from "./delete-circle-dialog-content"
import EditCircleDialogContent from "./edit-circle-dialog-content"

type Props = {
  circle: CircleWithMyRank[0]
}
export default function CircleCard({ circle }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [dialogContentType, setDialogContentType] = useState<"edit" | "delete" | null>(null)

  return (
    <Dialog>
      <Link href={`/${circle.slug}`} key={circle.id}>
        <Card forceHoverState={isDropdownOpen} className={cn(isDropdownOpen && "border-accent")}>
          <div className="flex w-full items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-accent">{circle.name}</h3>

            <DropdownMenu onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger className="-mr-1 outline-none">
                <EllipsisVertical
                  size="16"
                  className={cn(
                    "text-neutral-300 transition-opacity hover:text-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-300",
                    isDropdownOpen && "text-neutral-400 dark:text-neutral-300",
                  )}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="right">
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setDialogContentType("edit")
                    }}
                  >
                    Rename
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setDialogContentType("delete")
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col gap-0 text-base">
            {circle.myRank && (
              <div className="font-mono font-extrabold">
                <span className="dark:text-neutral-100">#{circle.myRank}</span>
                <span className="text-neutral-300 dark:text-neutral-600">
                  /{circle.members.length}
                </span>
              </div>
            )}
            {!circle.myRank && (
              <div className="font-mono">
                <span className="text-neutral-300 dark:text-neutral-600">n/a</span>
              </div>
            )}
            <div
              className={cn(
                "leading-0 text-sm leading-3",
                "text-neutral-300 dark:text-neutral-600",
              )}
            >
              your rank
            </div>
          </div>
        </Card>
      </Link>

      {dialogContentType === "edit" && <EditCircleDialogContent circle={circle} />}
      {dialogContentType === "delete" && <DeleteCircleDialogContent circle={circle} />}
    </Dialog>
  )
}
