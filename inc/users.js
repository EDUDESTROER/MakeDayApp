import conn from './db.js';


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
export async function register(nickName, firstName, lastName, email, password){

    let fullName = `${firstName} ${lastName}`;
    let admin = 0;

    return new Promise((resolve, reject)=>{
        conn.query(`
            INSERT INTO tb_users (name, email, admin, password, fullName)
            VALUES(?, ?, ?, ?, ?)
        `, [
            nickName,
            email,
            admin,
            password,
            fullName
        ], (err, results)=>{

            if(err){

                reject(err);

            }else{

                resolve(results);

            }

        });
    });

}
