import React, { PropsWithChildren, HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLSpanElement> &
  PropsWithChildren<{
    color?: "highlight" | "golden" | null
    selected?: boolean
  }>

const MemberPill = ({ color, children, ...props }: Props) => {
  return (
    <span
      className={`inline-block py-1 px-4 text font-light rounded-full cursor-pointer transition-all duration-300 select-none ring-1
      ${
        color === "highlight"
          ? // highlight
            `bg-neutral-900   dark:bg-neutral-200 
            text-white dark:text-black  
            hover:bg-neutral-800 dark:hover:bg-neutral-300 
            ring-neutral-900 dark:ring-neutral-200`
          : color === "golden"
            ? // golden
              ` text-white dark:text-black 
            bg-accent
            hover:bg-accent  ring-accent`
            : // default
              `hover:bg-neutral-200   dark:text-neutral-400
              ring-neutral-900 dark:ring-neutral-500
              dark:hover:bg-neutral-900`
      }`}
      {...props}
    >
      {children}
    </span>
  )
}

export default MemberPill
