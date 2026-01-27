import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, EyeOff } from "lucide-react"

type VisibilityToggleProps = {
  showHidden: boolean
  onToggle: () => void
}

export function VisibilityToggle({ showHidden, onToggle }: VisibilityToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
          {showHidden ? <Eye size={14} /> : <EyeOff size={14} />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Show/hide inactive members</TooltipContent>
    </Tooltip>
  )
}
