import fs from 'fs/promises';
import path from 'path';

export async function deleteUserFiles(avatar, attachments){

    // Avatar
    if(avatar){

        try{
            const avatarPath = path.join(
                process.cwd(),
                'uploads',
                'avatares',
                avatar
            );


            if(avatar) await fs.unlink(avatarPath);

        }catch(err){

            console.error(err);
        }


    }

    // Anexos
    for(const attachment of attachments){

        if(!attachment.image) continue;

        try{

            const imagePath = path.join(
                process.cwd(),
                'uploads',
                'attachments', 
                attachment.image
            );

            await fs.unlink(imagePath);

        }catch(err){

            console.error(err);

        }

    }

}