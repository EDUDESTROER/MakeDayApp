import { mergeSettings } from "../services/settings.service.js";

export async function getSettings(req, res){
    
    try{

        const settings = await mergeSettings(req.session.user.id);

        res.json(settings);

    }catch(err){

        console.error(err);

        return res.status(401).json({
            gravity: 10,
            error: 'Unable to recover settings -_-'
        });

    }

}