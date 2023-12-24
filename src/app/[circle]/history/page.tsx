import { supabase } from "@/supabase"
import { format } from "date-fns"

export default async function ResultsPage() {
  const { data: history, error } = await supabase
    .from("games")
    .select("*, game_results(*, member:circle_members(display_name)) ")
    .order("created_at", { ascending: false })

  if (!history) return null

  return (
    <div className="font-mono mt-10">
      {history.map((game) => (
        <p key={game.id} className="py-1 text-gray-500">
          <time dateTime={game.created_at} className="text-gray-500 dark:text-gray-600">
            {format(game.created_at, "MMM dd")} -{" "}
          </time>

          {game.game_results.map((result) => (
            <span
              key={result.member_id}
              className={`
              italic inline-block px-1
              ${
                result.winner
                  ? "text-accent font-bold"
                  : "text-gray-500 dark:text-gray-600 font-light"
              }
            `}
            >
              {result.member?.display_name}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}
