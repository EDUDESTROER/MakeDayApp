import conn from '../config/db.js';

export async function createNewNote(id, userId, title, parentId, icon, image, content, favorite){

    //console.log('repository: ', id, userId, title, parentId, icon, image, content, favorite)

    const [rows] = await conn.execute(
        `INSERT INTO notes (id, user_id, title, parent_id, icon, image, content, is_favorite)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, userId, title, parentId ?? null, icon, image ?? null, content ?? null, favorite]
    );

    console.log('repository result: ', rows)

    return {
        id,
        userId,
        title,
        parentId: parentId ?? null,
        icon: icon,
        image: image ?? null,
        content: content ?? null,
        favorite,
        createdAt: new Date(),
        updatedAt: new Date()
    };

}