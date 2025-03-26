import { cn } from "@/lib/utils"

type Props = React.PropsWithChildren<{ className?: string }>

export function ScrollContainer({ children, className }: Props) {
  return (
    <div
      className={cn("scrollbar relative overflow-x-auto", className)}
      style={{
        scrollbarWidth: "none",
      }}
    >
      <div className="inline-flex">{children}</div>
    </div>
  )
}
