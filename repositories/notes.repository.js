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
    favorite,
    search
){

    icon = icon === undefined ? '' : icon;

    //console.log('repository: ', id, userId, title, parentId, icon, emoji, image, content, favorite)


    const [rows] = await conn.execute(
        `INSERT INTO notes (id, user_id, title, parent_id, icon, emoji, image, content, is_favorite, search_content)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, userId, title, parentId ?? null, icon, emoji, image ?? null, content ?? null, favorite, search]
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
    favorite,
    search
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
            is_favorite = ?,
            search_content = ?
        WHERE id = ? AND user_id = ?`,
        [
            title, 
            parentId ?? null, 
            icon, 
            emoji,
            image ?? null, 
            content ?? null, 
            favorite,
            search,
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
export async function searchTitle(term, id){

    const [rows] = await conn.execute(
        `SELECT
            id,
            title,
            parent_id,
            icon,
            emoji,
            MATCH(title)
            AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance
        FROM notes
        WHERE
            user_id = ?
            AND(
                MATCH(title)
                AGAINST(? IN NATURAL LANGUAGE MODE)
                OR
                title LIKE ?
            )
        ORDER BY relevance DESC
        LIMIT 20
        `,
        [term, id, term, `%${term}%`]
    );

    return rows

}
export async function searchContent(term, id){

    const [rows] = await conn.execute(
        `SELECT
            id,
            title,
            parent_id,
            icon,
            emoji,
            search_content,
            MATCH(search_content)
            AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance
        FROM notes
        WHERE
            user_id = ?
            AND(
                MATCH(search_content)
                AGAINST(? IN NATURAL LANGUAGE MODE)
                OR
                search_content LIKE ?
            )
        ORDER BY relevance DESC
        LIMIT 20
        `,
        [term, id, term, `%${term}%`]
    );

    return rows;

}
export async function updateNoteName(userId, noteId, newTitle){

    /*console.log('User: ', userId);
    console.log('Note: ', noteId);
    console.log('New note Title: ', newTitle);*/

    const [rows] = await conn.execute(
        `UPDATE notes
        SET title = ? 
        WHERE id = ? AND user_id = ?`,
        [
            newTitle,
            noteId,
            userId
        ]
    );

    //console.log(rows);

    if(rows.affectedRows > 0) return true;

    return false;

}