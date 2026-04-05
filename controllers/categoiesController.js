import { createCategoryService } from "../services/categories.service.js";

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