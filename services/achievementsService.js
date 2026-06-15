import { getUserAchievements } from "../repositories/achievements.repository.js";

export async function getAchievementsService(userId){

    try{

      const allAchievements = await getUserAchievements(userId);

      return allAchievements;

    }catch(err){

        throw new Error(err);

    }

}