import { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren<{
    secondary?: boolean
  }>

export default function Button({ children, secondary, ...btnProps }: Props) {
  const { disabled } = btnProps

  const color = secondary
    ? // secondary
      "bg-none text-black"
    : // primary
      "bg-black text-white "

  return (
    <button
      type="button"
      className={`inline-flex justify-center px-6 py-3 text-sm sm:mt-0 sm:w-auto rounded-full border-none outline-none
        ${color} 
        ${disabled ? " opacity-50 cursor-default" : ""}
        `}
      {...btnProps}
    >
      {children}
    </button>
  )
}
