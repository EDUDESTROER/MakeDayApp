import conn from './db.js';

let users = {

    loginEmail(email, password){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_users WHERE email = ?    
            `, [
                email
            ], (err, results)=>{

                if(err){

                    reject(err);

                }else{

                    if(!results.length > 0){

                        reject("Incorrect username or password.");

                    }else{

                        console.log(results);

                        let row = results[0];

                        if(row.password !== password){

                            reject("Incorrect username or password");

                        }else{

                            console.log(results);

                            resolve(row);

                        }

                    }

                }

            });

        });

    },

    loginUsername(username, password){

        return new Promise((resolve, reject)=>{

            conn.query(`
                SELECT * FROM tb_users WHERE name = ?
            `, [
                username
            ], (err, results)=>{

                if(err){

                    reject(err);

                }else{

                    if(!results.length > 0){

                        reject("Usuário ou senha incorretos.");

                    }else{

                        //console.log(results);

                        let row = results[0];

                        if(row.password !== password){

                            reject("Usuário ou senha incorretos.");

                        }else{

                            resolve(row);

                        }

                    }

                }

            });

        });

    },
    register(nickName, firstName, lastName, email, password){

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

}

export default users;