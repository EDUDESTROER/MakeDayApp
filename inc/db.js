import mysql from 'mysql2';

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'eduardo',
    database: 'makedaytest',
    password: 'Edu159.s.p'
});

export default conn;