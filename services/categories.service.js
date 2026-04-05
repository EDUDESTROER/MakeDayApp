import categoriesSchema from '../schemas/categories.schema.js';
import {createNewCategory} from '../repositories/categories.repository.js';
import * as z from 'zod';

export async function createCategoryService(userId, title, viewMode, parentId){

    try{
        const validation = categoriesSchema.safeParse({title, viewMode, parentId});

        if(!validation.success){

            const errors = z.flattenError(validation.error);
                
            const firstValue = Object.values(errors.fieldErrors)[0];
                
            throw new Error(firstValue || 'erro zod');
                

        }

        const id = crypto.randomUUID();

        const {title: testedTitle, viewMode: testedViewMode, parentId: testedParentId} = validation.data;

        const category = await createNewCategory(id, userId, testedTitle, testedViewMode, testedParentId);

        return category;

    }catch(error){

        throw new Error(error);

    }

}