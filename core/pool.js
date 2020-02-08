const mysql = require("mysql");
const util = require("util");

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "",
    database: "arkav"
});

pool.getConnection((err, conn) => {
    if(err) throw err;
    if(conn){
        conn.release();
    }
});

pool.query = util.promisify(pool.query);

module.exports = pool;