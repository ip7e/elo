type CreateGameSessionRequest = {
  loserIds: number[]
  winnerIds: number[]
  circleId: number
}
export const createGameSession = async (body: CreateGameSessionRequest) => {
  const { data, error } = await fetch("/api/create-game-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json())

  return { data, error }
}
