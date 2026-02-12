import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"

type PropsWithChildrenAndClassName = PropsWithChildren<{ className?: string }>

export function DotGrid({ className, children }: PropsWithChildrenAndClassName) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgb(223,223,223)_1px,transparent_0)] bg-[size:12px_12px] [mask-image:radial-gradient(50%_50%_at_50%_40%,transparent_55%,black)] dark:bg-[radial-gradient(rgb(40,40,40)_1px,transparent_0)]" />
      {children}
    </div>
  )
}
