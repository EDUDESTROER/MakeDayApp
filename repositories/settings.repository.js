import conn from '../config/db.js';

export async function getUserSettings(id){

    const [rows] = await conn.execute(
        `SELECT settings FROM user_settings WHERE user_id = ?`,
        [id]
    );

    return rows;
}