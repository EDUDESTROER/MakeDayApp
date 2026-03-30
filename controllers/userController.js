import { checkUser } from "../services/auth.service.js";

export async function getUserInfo(req, res){
    
    try{

        const userInfo = await checkUser(req.session.user.id);

        res.json(userInfo);

    }catch(err){

        return res.status(401).json({
            gravity: 10,
            error: err.message || 'Error!'
        });

    }

}