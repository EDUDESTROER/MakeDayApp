import sharp from "sharp";
import fs from "fs/promises";

export async function processAvatar(
    inputPath,
    oldAvatarPath,
    outputPath
){
    const buffer = await fs.readFile(inputPath);

    await sharp(buffer)
        .resize(256, 256, {
            fit: 'cover',
            position: 'centre'
        })
        .webp({
            quality: 90
        })
        .toFile(outputPath);

    //console.log('Sharp finished');  

    await new Promise(resolve =>
        setTimeout(resolve, 1000)
    );

    try{

        //await deleteFile(oldAvatarPath);
        await fs.unlink(oldAvatarPath);
        //await deleteFile(inputPath);
        await fs.unlink(inputPath);
        

    }catch(err){

        console.error(err);

    }

    //console.log('File deleted');

}

/*async function deleteFile(path) {
    
    for (let i = 0; i < 8; i++){

        try{

            await fs.unlink(path);
            return;

        }catch(err){

            if(err.code !== 'EPERM'){
                throw err;
            }

            await new Promise(resolve => setTimeout(resolve, 500));

        }

    }

}*/