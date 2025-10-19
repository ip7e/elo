import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/utils/tailwind/cn"

type VisibilityToggleProps = {
  showHidden: boolean
  onToggle: () => void
  variant?: "mobile" | "desktop"
}

/**
 * VisibilityToggle component allows users to show/hide inactive members.
 * Supports both mobile (button) and desktop (icon) variants.
 */
export function VisibilityToggle({
  showHidden,
  onToggle,
  variant = "desktop",
}: VisibilityToggleProps) {
  if (variant === "mobile") {
    return (
      <Button variant="ghost" size="sm" onClick={onToggle} className="sm:hidden">
        {showHidden ? <Eye size={16} /> : <EyeOff size={16} />}
      </Button>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onToggle}
          className="absolute -top-5 right-0 hidden text-muted-foreground hover:text-primary sm:block"
        >
          {showHidden ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="left">Show/hide inactive members</TooltipContent>
    </Tooltip>
  )
}
