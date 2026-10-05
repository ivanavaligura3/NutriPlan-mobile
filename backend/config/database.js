const mysql = require('mysql2/promise');

// Kreiranje pool-a za povezivanje sa MySQL bazom
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    dateStrings: true,

    // Omogućava ponovno korišćenje konekcija
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;