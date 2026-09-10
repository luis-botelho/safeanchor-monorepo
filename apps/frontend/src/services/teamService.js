import { marinaTeams } from "../mock/marinaTeam";

export async function getTeamByMarina(marinaId) {
  const team = marinaTeams.find((item) => item.marinaId === marinaId);
  return team ? team.members : [];
}

export async function getActiveTeamByMarina(marinaId) {
  const members = await getTeamByMarina(marinaId);
  return members.filter((member) => member.status !== "Em folga");
}