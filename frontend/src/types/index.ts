export interface Player {
  id: string
  nickname: string
  totalPoints: number
  createdAt: string
  updatedAt: string
}

export interface History {
  id: string
  playerID: string
  pointsGained: number
  source: string
  createdAt: string
}

export interface Reward {
  id: string
  playerID: string
  checkpointVal: number
  claimedAt: string
}

export interface Game {
  spinId: string
  pointsGained: number
  totalPointsAfter: number
}