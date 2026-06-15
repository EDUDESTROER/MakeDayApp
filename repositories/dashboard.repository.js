import conn from '../config/db.js';

export async function getUserGoals(id){

    const [rows] = await conn.execute(
        `SELECT id, title, target_value, target_day FROM goals WHERE user_id = ?`,
        [id]
    );

    return rows;
}
export async function getUserGoalsLog(id){

    const [rows] = await conn.execute(
        `SELECT 
            goal_id, 
            date, 
            current_value, 
            target_value, 
            completed 
        FROM goals_logs 
        WHERE user_id = ?`,
        [id]
    );

    return rows;
}