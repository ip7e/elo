import React, { PropsWithChildren, HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLSpanElement> &
  PropsWithChildren<{
    color?: "highlight" | "golden" | null
    selected?: boolean
  }>

const MemberPill = ({ color, children, ...props }: Props) => {
  return (
    <span
      className={`inline-block py-1 px-4 text-lg font-mono font-semibold rounded-full cursor-pointer transition-all duration-300 select-none 
      ${
        color === "highlight"
          ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-black"
          : color === "golden"
            ? "bg-yellow-500 text-white dark:text-black hover:bg-yellow-500"
            : " hover:bg-gray-200 ring-1 ring-gray-900 dark:text-gray-400 dark:ring-gray-800 dark:hover:bg-gray-900"
      }`}
      {...props}
    >
      {children}
    </span>
  )
}

export default MemberPill
