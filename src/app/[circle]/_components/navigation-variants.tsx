"use client"

import Logo from "@/components/logo"
import { cn } from "@/utils/tailwind/cn"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Circle } from "../../../server/types"
import LoggedIn from "@/app/_components/logged-in"
import LoggedOut from "@/app/_components/logged-out"
import HasAccess from "./has-access"
import { Plan } from "./plan"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, Settings, Grid3X3, Home, CircleDot } from "lucide-react"
import EditCircleDialogContent from "@/app/me/_components/edit-circle-dialog-content"
import { useState } from "react"
import { Button } from "@/components/ui/button"

type Props = { circle: Circle }

const routes = (slug: string) => [
  { pathname: `/${slug}`, label: "ranking" },
  { pathname: `/${slug}/history`, label: "history" },
]

// ============================================================================
// VARIANT 1: Logo | Nav centered | Circle dropdown right
// Clean separation - nav is independent, circle is a dropdown on the right
// ============================================================================
export function Variant1({ circle }: Props) {
  const currentPathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="fixed top-0 z-auto flex w-full items-center justify-between p-4 font-medium text-gray-400 dark:text-gray-300">
      {/* Left: Logo only */}
      <Link href="/me">
        <Logo className="w-16 text-gray-600 dark:text-gray-200" />
      </Link>

      {/* Center: Navigation */}
      <nav className="flex gap-4">
        {routes(circle.slug).map(({ pathname, label }) => (
          <Link
            href={pathname}
            key={pathname}
            className={cn(
              "transition-colors hover:text-gray-600 dark:hover:text-gray-100",
              currentPathname === pathname && "text-accent"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Right: Circle name as dropdown + settings */}
      <div className="flex items-center gap-2">
        <Link href="/me">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <span>{circle.name.toLowerCase()}</span>
            <Plan.Trial>
              <span className="rounded-full bg-gray-200/60 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700/60 dark:text-gray-400">
                free
              </span>
            </Plan.Trial>
            <Plan.Pro>
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                pro
              </span>
            </Plan.Pro>
            <ChevronDown size={14} />
          </Button>
        </Link>
        <HasAccess>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings size={16} />
              </Button>
            </DialogTrigger>
            <EditCircleDialogContent circle={circle} />
          </Dialog>
        </HasAccess>
      </div>
    </div>
  )
}

// ============================================================================
// VARIANT 2: Logo | Circle badge | Nav | -----spacer----- | My Circles | Settings
// Circle is a subtle badge, not mixed with nav
// ============================================================================
export function Variant2({ circle }: Props) {
  const currentPathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="fixed top-0 z-auto flex w-full items-center gap-6 p-4 font-medium text-gray-400 dark:text-gray-300">
      {/* Logo */}
      <Link href="/me">
        <Logo className="w-16 text-gray-600 dark:text-gray-200" />
      </Link>

      {/* Circle badge - clickable goes to circles list */}
      <Link
        href="/me"
        className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <CircleDot size={14} />
        {circle.name.toLowerCase()}
        <Plan.Pro>
          <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-xs text-accent">
            pro
          </span>
        </Plan.Pro>
      </Link>

      {/* Navigation */}
      <nav className="flex gap-4">
        {routes(circle.slug).map(({ pathname, label }) => (
          <Link
            href={pathname}
            key={pathname}
            className={cn(
              "transition-colors hover:text-gray-600 dark:hover:text-gray-100",
              currentPathname === pathname && "text-accent"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: My Circles + Settings */}
      <div className="flex items-center gap-2">
        <Link href="/me">
          <Button variant="ghost" size="sm">
            <Grid3X3 size={16} className="mr-2" />
            My Circles
          </Button>
        </Link>
        <HasAccess>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings size={16} />
              </Button>
            </DialogTrigger>
            <EditCircleDialogContent circle={circle} />
          </Dialog>
        </HasAccess>
      </div>
    </div>
  )
}

// ============================================================================
// VARIANT 3: Logo+Circle combined | -----spacer----- | Nav | Settings
// Logo and circle are a unit on left, nav on right
// ============================================================================
export function Variant3({ circle }: Props) {
  const currentPathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="fixed top-0 z-auto flex w-full items-center justify-between p-4 font-medium text-gray-400 dark:text-gray-300">
      {/* Left: Logo + Circle name stacked */}
      <div className="flex items-center gap-3">
        <Link href="/me">
          <Logo className="w-16 text-gray-600 dark:text-gray-200" />
        </Link>
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">circle</span>
          <Link href="/me" className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
            {circle.name.toLowerCase()}
            <Plan.Pro>
              <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-xs text-accent">
                pro
              </span>
            </Plan.Pro>
          </Link>
        </div>
      </div>

      {/* Right: Nav + Settings */}
      <div className="flex items-center gap-4">
        <nav className="flex gap-4">
          {routes(circle.slug).map(({ pathname, label }) => (
            <Link
              href={pathname}
              key={pathname}
              className={cn(
                "transition-colors hover:text-gray-600 dark:hover:text-gray-100",
                currentPathname === pathname && "text-accent"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
        <HasAccess>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings size={16} />
              </Button>
            </DialogTrigger>
            <EditCircleDialogContent circle={circle} />
          </Dialog>
        </HasAccess>
      </div>
    </div>
  )
}

// ============================================================================
// VARIANT 4: Breadcrumb style - Logo / Circle / Page
// Everything flows like a path
// ============================================================================
export function Variant4({ circle }: Props) {
  const currentPathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const currentRoute = routes(circle.slug).find(r => r.pathname === currentPathname)

  return (
    <div className="fixed top-0 z-auto flex w-full items-center justify-between p-4 font-medium text-gray-400 dark:text-gray-300">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/me" className="hover:text-gray-600 dark:hover:text-gray-100">
          <Logo className="w-12 text-gray-600 dark:text-gray-200" />
        </Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <Link href="/me" className="hover:text-gray-600 dark:hover:text-gray-100">
          {circle.name.toLowerCase()}
        </Link>
        <Plan.Pro>
          <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-xs text-accent">
            pro
          </span>
        </Plan.Pro>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <span className="text-accent">{currentRoute?.label}</span>
      </div>

      {/* Right: Nav tabs + Settings */}
      <div className="flex items-center gap-2">
        <nav className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {routes(circle.slug).map(({ pathname, label }) => (
            <Link
              href={pathname}
              key={pathname}
              className={cn(
                "rounded-md px-3 py-1 text-sm transition-colors",
                currentPathname === pathname
                  ? "bg-white text-accent shadow-sm dark:bg-gray-700"
                  : "hover:text-gray-600 dark:hover:text-gray-100"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <HasAccess>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings size={16} />
              </Button>
            </DialogTrigger>
            <EditCircleDialogContent circle={circle} />
          </Dialog>
        </HasAccess>
      </div>
    </div>
  )
}

// ============================================================================
// VARIANT 5: Minimal - Just logo and nav, circle in a subtle top bar
// Two-row header with context bar
// ============================================================================
export function Variant5({ circle }: Props) {
  const currentPathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="fixed top-0 z-auto w-full">
      {/* Context bar */}
      <div className="flex items-center justify-between bg-gray-50 px-4 py-1 text-xs dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Currently viewing:</span>
          <span className="font-medium text-gray-600 dark:text-gray-300">{circle.name.toLowerCase()}</span>
          <Plan.Pro>
            <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-accent">pro</span>
          </Plan.Pro>
        </div>
        <Link href="/me" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          Switch circle
        </Link>
      </div>

      {/* Main nav */}
      <div className="flex items-center justify-between bg-white/80 p-4 backdrop-blur-sm dark:bg-gray-950/80">
        <Link href="/me">
          <Logo className="w-16 text-gray-600 dark:text-gray-200" />
        </Link>

        <div className="flex items-center gap-4">
          <nav className="flex gap-4 font-medium text-gray-400 dark:text-gray-300">
            {routes(circle.slug).map(({ pathname, label }) => (
              <Link
                href={pathname}
                key={pathname}
                className={cn(
                  "transition-colors hover:text-gray-600 dark:hover:text-gray-100",
                  currentPathname === pathname && "text-accent"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <HasAccess>
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings size={16} />
                </Button>
              </DialogTrigger>
              <EditCircleDialogContent circle={circle} />
            </Dialog>
          </HasAccess>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// VARIANT 6: Circle-centric - Circle name prominent, logo small
// The circle is the hero, not the app
// ============================================================================
export function Variant6({ circle }: Props) {
  const currentPathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="fixed top-0 z-auto flex w-full items-center justify-between p-4 font-medium">
      {/* Left: Circle as hero with nav tabs beneath */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <span className="text-lg font-bold text-accent">
              {circle.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {circle.name.toLowerCase()}
              </span>
              <Plan.Pro>
                <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-xs text-accent">
                  pro
                </span>
              </Plan.Pro>
            </div>
          </div>
        </div>

        <nav className="flex gap-1 text-gray-400 dark:text-gray-300">
          {routes(circle.slug).map(({ pathname, label }) => (
            <Link
              href={pathname}
              key={pathname}
              className={cn(
                "rounded-md px-3 py-1.5 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-100",
                currentPathname === pathname && "bg-gray-100 text-accent dark:bg-gray-800"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right: Home + Settings */}
      <div className="flex items-center gap-2">
        <Link href="/me">
          <Button variant="ghost" size="sm">
            <Home size={16} className="mr-2" />
            All Circles
          </Button>
        </Link>
        <HasAccess>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings size={16} />
              </Button>
            </DialogTrigger>
            <EditCircleDialogContent circle={circle} />
          </Dialog>
        </HasAccess>
      </div>
    </div>
  )
}

// ============================================================================
// VARIANT 7: Compact pill nav - Everything in one line, nav as pills
// Super clean and minimal
// ============================================================================
export function Variant7({ circle }: Props) {
  const currentPathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="fixed top-0 z-auto flex w-full items-center justify-between p-4 font-medium text-gray-400 dark:text-gray-300">
      {/* Left: Logo */}
      <Link href="/me">
        <Logo className="w-14 text-gray-600 dark:text-gray-200" />
      </Link>

      {/* Center: Circle + Nav pills combined */}
      <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1 dark:bg-gray-800">
        <Link
          href="/me"
          className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <ChevronDown size={14} />
          {circle.name.toLowerCase()}
        </Link>
        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
        {routes(circle.slug).map(({ pathname, label }) => (
          <Link
            href={pathname}
            key={pathname}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm transition-colors",
              currentPathname === pathname
                ? "bg-white text-accent shadow-sm dark:bg-gray-700"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Right: Settings only */}
      <HasAccess>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full">
              <Settings size={16} />
            </Button>
          </DialogTrigger>
          <EditCircleDialogContent circle={circle} />
        </Dialog>
      </HasAccess>
    </div>
  )
}

// ============================================================================
// VARIANT 8: Sidebar hint - Logo left, nav underlined, circle as tag
// More editorial/blog style
// ============================================================================
export function Variant8({ circle }: Props) {
  const currentPathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="fixed top-0 z-auto flex w-full items-center justify-between border-b border-gray-100 bg-white/90 p-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/90">
      {/* Left: Logo + nav */}
      <div className="flex items-center gap-8">
        <Link href="/me">
          <Logo className="w-14 text-gray-600 dark:text-gray-200" />
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-400 dark:text-gray-300">
          {routes(circle.slug).map(({ pathname, label }) => (
            <Link
              href={pathname}
              key={pathname}
              className={cn(
                "border-b-2 border-transparent pb-0.5 transition-colors hover:text-gray-600 dark:hover:text-gray-100",
                currentPathname === pathname && "border-accent text-accent"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right: Circle tag + Settings */}
      <div className="flex items-center gap-3">
        <Link
          href="/me"
          className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200"
        >
          {circle.name.toLowerCase()}
          <Plan.Pro>
            <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-xs text-accent">
              pro
            </span>
          </Plan.Pro>
        </Link>
        <HasAccess>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings size={16} />
              </Button>
            </DialogTrigger>
            <EditCircleDialogContent circle={circle} />
          </Dialog>
        </HasAccess>
      </div>
    </div>
  )
}

// ============================================================================
// VARIANT 9: Split - Left side for branding, right for actions
// Clear visual separation
// ============================================================================
export function Variant9({ circle }: Props) {
  const currentPathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="fixed top-0 z-auto flex w-full font-medium">
      {/* Left panel */}
      <div className="flex items-center gap-4 bg-gray-50 p-4 dark:bg-gray-900">
        <Link href="/me">
          <Logo className="w-14 text-gray-600 dark:text-gray-200" />
        </Link>
        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
        <Link href="/me" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100">
          {circle.name.toLowerCase()}
          <Plan.Pro>
            <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-xs text-accent">
              pro
            </span>
          </Plan.Pro>
        </Link>
      </div>

      {/* Right panel - grows to fill */}
      <div className="flex flex-1 items-center justify-between p-4">
        <nav className="flex gap-4 text-gray-400 dark:text-gray-300">
          {routes(circle.slug).map(({ pathname, label }) => (
            <Link
              href={pathname}
              key={pathname}
              className={cn(
                "transition-colors hover:text-gray-600 dark:hover:text-gray-100",
                currentPathname === pathname && "text-accent"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/me">
            <Button variant="outline" size="sm">
              My Circles
            </Button>
          </Link>
          <HasAccess>
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings size={16} />
                </Button>
              </DialogTrigger>
              <EditCircleDialogContent circle={circle} />
            </Dialog>
          </HasAccess>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// VARIANT 10: Floating card - Header as a floating element
// Modern app style with elevation
// ============================================================================
export function Variant10({ circle }: Props) {
  const currentPathname = usePathname()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="fixed top-4 left-4 right-4 z-auto">
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-gray-200/50 bg-white/80 p-3 shadow-lg shadow-gray-200/50 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80 dark:shadow-gray-900/50">
        {/* Left: Logo */}
        <Link href="/me">
          <Logo className="w-12 text-gray-600 dark:text-gray-200" />
        </Link>

        {/* Center: Circle + Nav */}
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link
            href="/me"
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <CircleDot size={14} />
            {circle.name.toLowerCase()}
            <Plan.Pro>
              <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-xs text-accent">
                pro
              </span>
            </Plan.Pro>
          </Link>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
          <nav className="flex gap-1 text-gray-400 dark:text-gray-300">
            {routes(circle.slug).map(({ pathname, label }) => (
              <Link
                href={pathname}
                key={pathname}
                className={cn(
                  "rounded-lg px-3 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                  currentPathname === pathname && "bg-gray-100 text-accent dark:bg-gray-800"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Settings */}
        <HasAccess>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-xl">
                <Settings size={16} />
              </Button>
            </DialogTrigger>
            <EditCircleDialogContent circle={circle} />
          </Dialog>
        </HasAccess>
      </div>
    </div>
  )
}

// ============================================================================
// PREVIEW PAGE - Shows all variants stacked
// ============================================================================
export default function NavigationVariantsPreview({ circle }: Props) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pb-20">
      <style>{`
        .preview-container > div:first-child {
          position: static !important;
          width: 100% !important;
        }
        .preview-container > div:first-child > div:first-child {
          position: static !important;
        }
      `}</style>
      {[
        { name: "1: Centered nav, circle dropdown right", Component: Variant1 },
        { name: "2: Circle badge, My Circles button right", Component: Variant2 },
        { name: "3: Logo+Circle left, nav right", Component: Variant3 },
        { name: "4: Breadcrumb style with pill nav", Component: Variant4 },
        { name: "5: Two-row with context bar", Component: Variant5 },
        { name: "6: Circle-centric (circle as hero)", Component: Variant6 },
        { name: "7: Compact pill nav centered", Component: Variant7 },
        { name: "8: Editorial style with underlined nav", Component: Variant8 },
        { name: "9: Split panels", Component: Variant9 },
        { name: "10: Floating card header", Component: Variant10 },
      ].map(({ name, Component }, i) => (
        <div key={i} className="border-b-4 border-gray-300 dark:border-gray-700">
          <div className="bg-gray-200 px-4 py-3 text-sm font-mono font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            {name}
          </div>
          <div className="preview-container bg-white dark:bg-gray-950">
            <Component circle={circle} />
          </div>
        </div>
      ))}
    </div>
  )
}
