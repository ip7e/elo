"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Circle } from "../types"
import Logo from "@/components/logo"
import AccessGuard from "../shared/access-guard"

type Props = { circle: Circle }

export default function Navigation({ circle }: Props) {
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

  return (
    <div
      className="flex gap-4 py-8 w-full p-4
      justify-between
      font-semibold text-gray-400
      "
    >
      <div className="flex gap-4 ">
        <Link href={circleRoot} className="flex gap-2 items-center">
          <Logo className="w-8 text-accent" />
          <div className="w-0.5 h-4 bg-gray-400/20 dark:bg-gray-200/30" />
          <h1>{circle.name}</h1>
        </Link>

        <nav className="flex gap-2">
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
      <div>
        <AccessGuard loadingCallback={<></>} noAuthCallback={<Link href="/auth">login</Link>}>
          logged in
        </AccessGuard>
      </div>
    </div>
  )
}
