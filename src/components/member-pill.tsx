import React, { PropsWithChildren, HTMLAttributes } from "react"

type Props = HTMLAttributes<HTMLSpanElement> &
  PropsWithChildren<{
    color?: "highlight" | "golden" | null
    selected?: boolean
  }>

const MemberPill = ({ color, children, ...props }: Props) => {
  return (
    <span
      className={`inline-block py-1 px-4 text-lg font-semibold border  rounded-full cursor-pointer transition-all duration-300 select-none
      ${
        color === "highlight"
          ? "bg-gray-900 text-white hover:bg-gray-800 scale-105"
          : color === "golden"
            ? "bg-yellow-500 text-white hover:bg-yellow-500 scale-105"
            : "hover:bg-gray-200 border-gray-900"
      }`}
      {...props}
    >
      {children}
    </span>
  )
}

export default MemberPill
