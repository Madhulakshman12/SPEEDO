const mysql = require('mysql2/promise');

const hostname = process.env.hostname;
const database = process.env.database;
const port = process.env.port;
const username = process.env.username;
const password = process.env.password;

const pool = mysql.createPool({
    host: hostname,
    user: username,
    password,
    database,
    port: port ? Number(port) : undefined,
    waitForConnections: true,
    // filess.io free/shared MySQL often allows only 5 user connections total.
    connectionLimit: Math.max(1, Number(process.env.DB_CONNECTION_LIMIT) || 1),
    maxIdle: Math.max(1, Number(process.env.DB_CONNECTION_LIMIT) || 1),
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

module.exports = pool;