import { getAchievementsService } from "../services/achievementsService.js";

export async function getUserAchievements(req, res){
    
    try{

        const achievements = await getAchievementsService(req.session.user.id);

        res.json(achievements);

    }catch(err){

        console.error(err);

        return res.status(401).json({
            gravity: 10,
            error: 'Unable to recover achievements -_-'
        });

    }

}