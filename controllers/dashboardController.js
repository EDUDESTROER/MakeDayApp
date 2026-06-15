import { getDashboardService } from "../services/dashboardService.js";

export async function getDashboardHome(req, res){
    
    try{

        const dashboard = await getDashboardService(req.session.user.id);

        res.json(dashboard);

    }catch(err){

        console.error(err);

        return res.status(401).json({
            gravity: 10,
            error: 'Unable to recover dashboard -_-'
        });

    }

}