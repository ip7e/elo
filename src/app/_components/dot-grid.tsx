import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"

type PropsWithChildrenAndClassName = PropsWithChildren<{ className?: string }>

export function DotGrid({ className, children }: PropsWithChildrenAndClassName) {
  return (
    <div
      className={cn(
        "bg-[mask-image:radial-gradient(farthest-side_at_50%_50%,black,transparent)] relative bg-[radial-gradient(rgb(223,223,223)_1px,transparent_0)] bg-[size:12px_12px] dark:bg-[radial-gradient(rgb(40,40,40)_1px,transparent_0)]",
        className,
      )}
    >
      {children}
    </div>
  )
}
