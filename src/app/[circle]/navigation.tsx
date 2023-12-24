"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function Navigation({ slug }: { slug: string }) {
  const currentPathname = usePathname()

  const routes = [
    {
      pathname: `/${slug}`,
      label: "leaderboard",
    },
    {
      pathname: `/${slug}/history`,
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
              className={`text-black ${
                currentPathname === route.pathname && "underline"
              } dark:text-white`}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
