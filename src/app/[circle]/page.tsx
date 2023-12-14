import { supabase } from "@/supabase";
import AddNewGame from "./add-new-game";
import { getMembersWithElo } from "../queries/get-members";

export default async function Home() {
  const { data: members, error } = await getMembersWithElo();

  return (
    <div className="mt-20">
      <table className="table border-separate border-spacing-x-5 border-spacing-y-1">
        <thead>
          <tr className="text-sm lowercase align-text-top opacity-60">
            <th className="invisible">Rank</th>
            <th className="invisible w-full">Player</th>
            <th className="text-right">Elo</th>
            <th className="pb-2 text-right">%</th>
          </tr>
        </thead>

        <tbody>
          {members?.map(({ display_name, new_elo }, i) => (
            <tr key={i} className="text-lg">
              <td>#{i + 1}</td>
              <td className="w-full">{display_name}</td>
              <td className="font-mono text-right">{new_elo}</td>
              <td className="font-mono text-right">99</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddNewGame />
    </div>
  );
}
