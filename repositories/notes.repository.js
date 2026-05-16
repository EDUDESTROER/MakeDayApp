import conn from '../config/db.js';

export async function createNewNote(
    id, 
    userId, 
    title, 
    parentId, 
    icon,
    emoji, 
    image, 
    content, 
    favorite
){

    icon = icon === undefined ? '' : icon;

    //console.log('repository: ', id, userId, title, parentId, icon, emoji, image, content, favorite)


    const [rows] = await conn.execute(
        `INSERT INTO notes (id, user_id, title, parent_id, icon, emoji, image, content, is_favorite)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, userId, title, parentId ?? null, icon, emoji, image ?? null, content ?? null, favorite]
    );

    //console.log('repository result: ', rows)

    return {
        id,
        userId,
        title,
        parent_id: parentId ?? null,
        icon: icon,
        emoji,
        image: image ?? null,
        content: content,
        is_favorite: favorite,
        createdAt: new Date(),
        updatedAt: new Date()
    };

}
export async function updateNote(
    id, 
    userId, 
    title, 
    parentId, 
    icon,
    emoji, 
    image, 
    content, 
    favorite
){

    icon = icon === undefined ? '' : icon;

    //console.log('repository: ', id, userId, title, parentId, icon, image, content, favorite)

    const [rows] = await conn.execute(
        `UPDATE notes
        SET title = ?, 
            parent_id = ?, 
            icon = ?,
            emoji = ?, 
            image = ?, 
            content = ?, 
            is_favorite = ?
        WHERE id = ? AND user_id = ?`,
        [
            title, 
            parentId ?? null, 
            icon, 
            emoji,
            image ?? null, 
            content ?? null, 
            favorite,
            id,
            userId
        ]
    );

    return {
        id,
        userId,
        title,
        parent_id: parentId ?? null,
        icon: icon,
        emoji: emoji,
        image: image ?? null,
        content: content,
        is_favorite: favorite,
        updated_at: new Date()
    };

}
export async function getAllNote(id){

    const [rows] = await conn.execute(
        `SELECT id, title, parent_id, icon, emoji, image, content, is_favorite, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC`,
        [id]
    );

    return rows;
}