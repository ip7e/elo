"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Circle } from "./types"

type Props = { circle: Circle }
export default function Navigation({ circle }: Props) {
  const currentPathname = usePathname()
  const slug = circle.slug

  const routes = [
    {
      pathname: `/${slug}`,
      label: "leaderboard",
    },
    {
      pathname: `/${slug}/history`,
      label: "history",
    },
    {
      pathname: `/${slug}/control`,
      label: "control",
    },
  ]
  return (
    <div
      className="flex gap-4 items-center py-8 
      text-black dark:text-white font-light"
    >
      <h1 className="">
        <Link href={`/${slug}`}>[{circle.name.toLowerCase()}]</Link>
      </h1>
      <nav className="flex gap-4">
        {routes.map((route) => (
          <Link
            key={route.pathname}
            href={route.pathname}
            className={`${
              currentPathname === route.pathname
                ? "text-black dark:text-white"
                : "text-neutral-400 dark:text-neutral-500"
            }`}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
