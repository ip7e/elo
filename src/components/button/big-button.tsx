import { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren<{
    secondary?: boolean
  }>

export default function BigButton({ children, secondary, ...btnProps }: Props) {
  const { disabled } = btnProps

  const color = secondary
    ? // secondary
      `
        bg-none text-black dark:text-neutral-200
        hover:underline
      `
    : // primary
      `text-white dark:text-black
      bg-neutral-800 dark:bg-neutral-200
      hover:bg-black dark:hover:bg-neutral-300`

  return (
    <button
      type="button"
      className={`inline-flex justify-center rounded-full border-none px-4 py-2 text-sm outline-none sm:mt-0 sm:w-auto ${color} ${disabled ? "cursor-default opacity-50" : ""} `}
      {...btnProps}
    >
      {children}
    </button>
  )
}
