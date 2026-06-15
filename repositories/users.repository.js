import conn from '../config/db.js';


export async function findAuthByEmail(email){

    const [rows] = await conn.execute(
        "SELECT id, password_hash, role FROM tb_users WHERE email = ?",
        [email]
    );

    return rows[0];

}
export async function findAuthById(userId){

    const [rows] = await conn.execute(
        "SELECT username, email, image FROM tb_users WHERE id = ?",
        [userId]
    );

    return rows[0];

}
export async function findAuthByUsername(username){

    const [rows] = await conn.execute(
        "SELECT id, password_hash, role FROM tb_users WHERE username = ?",
        [username]
    );

    return rows[0];


}
export async function registerUser(nickName, firstName, lastName, email, password){

    let fullName = `${firstName} ${lastName}`;
    const role = 'user';

    const [result] = await conn.execute(
        `
            INSERT INTO tb_users (username, email, role, password_hash, fullName)
            VALUES (?, ?, ?, ?, ?)
        `,
        [
            nickName,
            email,
            role,
            password,
            fullName
        ]
    );

    return [result.insertId, role];

}
export async function deleteUser(id){

    const [result] = await conn.execute(
        `
            DELETE FROM tb_users WHERE id = ?
            
        `,
        [
            id
        ]
    );

    return [result];

}
export async function changeEmail(email, id){

    const [result] = await conn.execute(
        `
            UPDATE tb_users 
            SET email = ?
            WHERE id = ?
            
        `,
        [
            email,
            id
        ]
    );

    return [result];

}
export async function changeName(name, id){

    const [result] = await conn.execute(
        `
            UPDATE tb_users 
            SET fullName = ?
            WHERE id = ?
            
        `,
        [
            name,
            id
        ]
    );

    return [result];

}
export async function changeNickname(nickname, id){

    const [result] = await conn.execute(
        `
            UPDATE tb_users 
            SET username = ?
            WHERE id = ?
            
        `,
        [
            nickname,
            id
        ]
    );

    return [result];

}
export async function changeAvatar(path, id){

    const [result] = await conn.execute(
        `
            UPDATE tb_users 
            SET image = ?
            WHERE id = ?
            
        `,
        [
            path,
            id
        ]
    );

    return [result];

}