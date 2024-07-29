"use client"

import Logo from "@/components/logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import HasAccess from "./has-access"
import { Circle } from "../../../server/types"
import { cn } from "@/utils/tailwind/cn"

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
    <div className="flex w-full justify-between gap-4 p-4 py-8 font-medium text-gray-400">
      <div className="flex gap-4">
        <Link href={circleRoot} className="flex items-center gap-2">
          <Logo className="w-8 text-accent" />
          <div className="h-4 w-0.5 bg-gray-400/20 dark:bg-gray-200/30" />
          <h1>{circle.name}</h1>
        </Link>

        <nav className="flex gap-2">
          {routes.map(({ pathname, label }) => (
            <Link
              href={pathname}
              key={pathname}
              className={cn(currentPathname === pathname && "text-accent")}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div>
        <HasAccess noAuthCallback={<Link href="/auth">login</Link>}>logged in</HasAccess>
      </div>
    </div>
  )
}
