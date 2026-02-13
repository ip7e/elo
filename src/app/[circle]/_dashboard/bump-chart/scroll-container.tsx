import { cn } from "@/lib/utils"
import { forwardRef } from "react"

type Props = React.PropsWithChildren<{ className?: string }>

export const ScrollContainer = forwardRef<HTMLDivElement, Props>(
  function ScrollContainer({ children, className }, ref) {
    return (
      <div
        ref={ref}
        className={cn("scrollbar relative overflow-x-auto", className)}
        style={{
          scrollbarWidth: "none",
        }}
      >
        <div className="inline-flex">{children}</div>
      </div>
    )
  },
)
