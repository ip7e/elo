"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const currentPathname = usePathname()

  const routes = [
    {
      pathname: "/",
      label: "leaderboard",
    },
    {
      pathname: "/history",
      label: "history",
    },
  ]
  return (
    <>
      <nav>
        <div className="flex font-mono gap-4">
          {routes.map((route) => (
            <Link
              key={route.pathname}
              href={route.pathname}
              className={`text-black ${currentPathname === route.pathname && "underline"}`}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
