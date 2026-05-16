import conn from '../config/db.js';

export async function createNewCategory(id, userId, title, view_mode, parentId){

    const [rows] = await conn.execute(
        `INSERT INTO categories (id, user_id, title, view_mode, parent_id)
        VALUES (?, ?, ?, ?, ?)`,
        [id, userId, title, view_mode, parentId || null]
    );

    return {
        id,
        title,
        view_mode,
        parentId: parentId ?? null,
        createAt: new Date(),
        updatedAt: new Date()
    };

}
export async function getAllCategory(id){

    const [rows] = await conn.execute(
        `SELECT id, title, view_mode, parent_id, created_at, updated_at FROM categories WHERE user_id = ?`,
        [id]
    );

    return rows;
}