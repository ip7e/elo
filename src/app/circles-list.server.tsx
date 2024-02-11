import { supabase } from "@/supabase"
import { Member } from "./[circle]/types"
import Link from "next/link"

type Props = {
  member: Member
}
export default async function CirclesList({ member }: Props) {
  const { data: circles } = await supabase.from("circles").select("*")

  if (!circles) return null

  return (
    <div className="flex items-center justify-center w-full h-full ">
      {circles.map((circle) => {
        return (
          <div key={circle.id} className="bg-white rounded-lg shadow-lg p-4 m-4">
            <Link href={circle.slug}>
              <h2>{circle.name}</h2>
              <p>/{circle.slug}</p>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
