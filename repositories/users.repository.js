import conn from './db.repository.js';


export async function findAuthByEmail(email){

    const [rows] = await conn.execute(
        "SELECT id, password_hash FROM tb_users WHERE email = ?",
        [email]
    );

    return rows[0];

}
export async function findAuthByUsername(username){

    const [rows] = await conn.execute(
        "SELECT id, password_hash FROM tb_users WHERE username = ?",
        [username]
    );

    return rows[0];


}
export async function registerUser(nickName, firstName, lastName, email, password){

    let fullName = `${firstName} ${lastName}`;
    const admin = 0;

    const [result] = await conn.execute(
        `
            INSERT INTO tb_users (username, email, admin, password_hash, fullName)
            VALUES (?, ?, ?, ?, ?)
        `,
        [
            nickName,
            email,
            admin,
            password,
            fullName
        ]
    );

    return result;

}
