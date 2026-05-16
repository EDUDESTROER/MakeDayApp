import categoriesSchema from '../schemas/categories.schema.js';
import {createNewCategory, getAllCategory} from '../repositories/categories.repository.js';
import * as z from 'zod';
import { sanitizeCategory } from '../utils/sanitizeHtml.js';

export async function createCategoryService(userId, title, viewMode, parentId){

    try{
        const validation = categoriesSchema.safeParse({title, viewMode, parentId});

        if(!validation.success){

            const errors = z.flattenError(validation.error);
                
            const firstValue = Object.values(errors.fieldErrors)[0];
                
            throw new Error(firstValue || 'erro zod');
                

        }

        const id = crypto.randomUUID();

        const sanitized = sanitizeCategory(validation.data);

        const {title: testedTitle, viewMode: testedViewMode, parentId: testedParentId} = sanitized;

        const category = await createNewCategory(id, userId, testedTitle, testedViewMode, testedParentId);

        return category;

    }catch(error){

        throw new Error(error);

    }

}
export async function getUserCategoryService(userId){

    try{

        const categories = await getAllCategory(userId);

        return categories;

    }catch(err){

        throw new Error(err);

    }

}