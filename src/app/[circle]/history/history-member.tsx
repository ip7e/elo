type Props = {
  name: string
  winner: boolean
}

export default function HistoryMember({ name, winner }: Props) {
  return (
    <span
      className={`
        italic inline-block px-1
        ${winner ? "text-accent font-bold" : "text-gray-500 dark:text-gray-600 font-light"}
      `}
    >
      {name}
    </span>
  )
}
