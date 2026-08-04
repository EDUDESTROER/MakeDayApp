import fs from "fs/promises";

export async function removeOldBackground(
    toRemove
){

    await new Promise(resolve =>
        setTimeout(resolve, 1000)
    );

    try{

        const toRemovePath =  `uploads/attachments/${toRemove}`;

        await fs.unlink(toRemovePath);
        

    }catch(err){

        console.error(err);

    }

    //console.log('File deleted');

}