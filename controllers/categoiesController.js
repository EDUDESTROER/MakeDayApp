import { createCategoryService, getUserCategoryService } from "../services/categories.service.js";

export async function createCategory(req, res){

    try{

        const SendUserId = req.session.user.id;

        const {title, viewMode, parentId} = req.body;

        const category = await createCategoryService(
            SendUserId,
            title,
            viewMode,
            parentId
        );

        const {resUserId: userId, ...safeCategory} = category
        
        res.status(201).json(safeCategory);

    } catch (error) {

        res.status(400).json({ error: error.message });

    }

}

export async function getUserCategory(req, res){

    try{

        const userId = req.session.user.id;

        const categories = await getUserCategoryService(userId);

        //console.log(categories);

        res.status(201).json(categories);

    }catch(err){

        res.status(400).json({error: err.message});

    }

}