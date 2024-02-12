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
      label: "settings",
    },
  ]
  return (
    <div
      className="flex gap-4 items-center py-8 
      text-black dark:text-white font-light"
    >
      <nav className="flex gap-2 relative">
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
            <div
              className={`w-8 h-2 rounded-full group 
            ${
              currentPathname === route.pathname
                ? "bg-accent"
                : `bg-neutral-200 dark:bg-neutral-700
                hover:bg-neutral-400 
                dark:hover:bg-neutral-400
                `
            }`}
              key={route.pathname}
            >
              <span className="block relative w-full h-full ">
                <span className="absolute inset-[-8px] rounded-full"></span>
              </span>
              <span
                className={`absolute top-4 left-0 right-0 text-center  
                opacity-0  pointer-events-none text-sm
                transition-all duration-150 ease-in-out
                group-hover:opacity-100
                ${currentPathname === route.pathname && "text-accent"}
                `}
              >
                {route.label}
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  )
}

// <Link
//             key={route.pathname}
//             href={route.pathname}
//             className={`${
//               currentPathname === route.pathname
//                 ? "text-black dark:text-white"
//                 : "text-neutral-400 dark:text-neutral-500"
//             }`}
//           >
//             {route.label}
//           </Link>
