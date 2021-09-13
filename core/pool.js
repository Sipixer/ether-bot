const util = require('util');
const mysql = require('mysql');
/**
 * Connection to the database.
 *  */
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: global.config.sql.user, // use your mysql username.
    password: global.config.sql.password, // user your mysql password.
    database: global.config.sql.database
});

pool.getConnection((err, connection) => {
    if (err)
        console.error("Something went wrong connecting to the database ...");

    if (connection)
        connection.release();
    return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;