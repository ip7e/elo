"use client"

import Logo from "@/components/logo"
import { cn } from "@/utils/tailwind/cn"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Circle } from "../../../server/types"
import LoggedIn from "@/app/_components/logged-in"
import LoggedOut from "@/app/_components/logged-out"

type Props = { circle: Circle }
export default function Navigation({ circle }: Props) {
  const currentPathname = usePathname()

  const routes = [
    {
      pathname: `/${circle.slug}`,
      label: "ranking",
    },
    {
      pathname: `/${circle.slug}/history`,
      label: "history",
    },
  ]

  return (
    <div className="fixed top-0 z-auto flex w-full justify-between gap-4 p-4 py-4 font-medium text-gray-400 dark:text-gray-300">
      <div className="flex items-center gap-4">
        <LoggedIn>
          <Link href={"/me"}>
            <Logo className="w-16 text-gray-600 dark:text-gray-200" />
          </Link>
        </LoggedIn>
        <LoggedOut>
          <Link href={"/"}>
            <Logo className="w-16 text-gray-600 dark:text-gray-200" />
          </Link>
        </LoggedOut>

        <div className="flex items-center gap-4">
          <div className="hidden h-fit items-center gap-4 sm:flex">
            <h1 className="ml-2">{circle.name.toLowerCase()}</h1>
            <div className="h-4 w-0.5 bg-gray-400/20 dark:bg-gray-200/30" />
          </div>

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
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <Link href="/me">my circles</Link>
      </div>
    </div>
  )
}
