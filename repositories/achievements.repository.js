import conn from '../config/db.js';

export async function getUserAchievements(id){

    const [rows] = await conn.execute(
        `SELECT 
            name
        FROM achievements 
        WHERE user_id = ?`,
        [id]
    );

    return rows;
}