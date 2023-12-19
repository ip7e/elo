export const createGameSession = async (memberIds: number[], winnerIds: number[]) => {
  const { data, error } = await fetch("/api/create-game-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ memberIds, winnerIds }),
  }).then((res) => res.json())

  return { data, error }
}
