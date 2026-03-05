import mysql from "mysql2/promise";

const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'eduardo',
    database: 'makedaytest',
    password: 'Edu159.s.p'
});

export default conn;