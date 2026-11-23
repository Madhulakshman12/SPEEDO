const mysql = require('mysql2/promise');

var hostname = process.env.hostname;
var database = process.env.database;
var port = process.env.port;
var username = process.env.username;
var password = process.env.password;

const pool = mysql.createPool({
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    host: hostname,
    user: username,
    password,
    database,
    port,

});

module.exports = pool;