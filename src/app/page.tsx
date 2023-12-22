import StatsServer from "./stats/stats-server"

export default async function Home() {
  return (
    <div className="mt-20">
      <StatsServer />

      <div className="mt-20">{/* <NewGameOpener members={allMembers} /> */}</div>
    </div>
  )
}
