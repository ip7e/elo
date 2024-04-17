"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Circle } from "./types"
import Logo from "@/components/logo"

type Props = { circle: Circle; isAdmin: boolean }
export default function Navigation({ isAdmin, circle }: Props) {
  const currentPathname = usePathname()
  const circleRoot = `/${circle.slug}`

  const routes = [
    {
      pathname: circleRoot,
      label: "ranking",
    },
    {
      pathname: `${circleRoot}/history`,
      label: "history",
    },
  ]

  if (isAdmin) {
    routes.push({
      pathname: `${circleRoot}/control`,
      label: "admin",
    })
  }

  return (
    <div
      className="flex gap-4 py-8 w-full p-4
      text-black dark:text-white font-light justify-between"
    >
      <Link className="flex gap-2 items-center" href={circleRoot}>
        <Logo className="w-8 text-accent" />
        <div className="w-0.5 h-4 bg-gray-400/20 dark:bg-gray-200/30" />
        <h1 className="font-semibold text-gray-400">{circle.name}</h1>
      </Link>

      <nav className="flex gap-2 relative font-semibold text-gray-400">
        {routes.map(({ pathname, label }) => (
          <Link
            href={pathname}
            key={pathname}
            className={currentPathname === pathname ? "text-accent" : ""}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
