export function generateGameCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function calculatePoints(timeRemaining: number, totalTime: number): number {
  const BASE_POINTS = 100;
  const speedBonus = Math.floor((timeRemaining / totalTime) * 100);
  return BASE_POINTS + speedBonus;
}
