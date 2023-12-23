export const createGameSession = async (loserIds: number[], winnerIds: number[]) => {
  const { data, error } = await fetch("/api/create-game-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ loserIds, winnerIds }),
  }).then((res) => res.json())

  return { data, error }
}
