import { fetchDotaHeroes, fetchDotaTeams } from "../controller/controller";

export const resolvers = {
  Query: {
    heroes: async () => {
      try {
        const heroes = await fetchDotaHeroes();
        return heroes;
      } catch (error) {
        console.error("Error fetching heroes:", error);
        throw new Error("Failed to fetch heroes");
      }
    },
    teams: async () => {
      try {
        const teams = await fetchDotaTeams();
        return teams;
      } catch (error) {
        console.error("Error fetching teams:", error);
        throw new Error("Failed to fetch teams");
      }
    },
  },
};
