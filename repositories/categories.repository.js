import conn from '../config/db.js';

export async function createNewCategory(id, userId, title, viewMode, parentId){

    const [rows] = await conn.execute(
        `INSERT INTO categories (id, user_id, title, view_mode, parent_id)
        VALUES (?, ?, ?, ?, ?)`,
        [id, userId, title, viewMode, parentId || null]
    );

    return {
        id,
        title,
        viewMode,
        parentId: parentId ?? null,
        createAt: new Date(),
        updatedAt: new Date()
    };

}