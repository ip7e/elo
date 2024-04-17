import Link from "next/link"

export default function MainNavigation() {
  return (
    <div className="fixed bottom-4 left-4 flex gap-2">
      <Link className="text-sm text-gray-400 hover:text-gray-200" href="/auth">
        login
      </Link>
      <Link className="text-sm text-gray-400 hover:text-gray-200" href="/auth">
        about
      </Link>
      <Link className="text-sm text-gray-400 hover:text-gray-200" href="/auth">
        github
      </Link>
    </div>
  )
}
